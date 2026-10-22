import { 
  db, 
  isFirebaseConfigured, 
  doc, 
  updateDoc, 
  arrayUnion 
} from '../firebase';
import { supabase, isSupabaseConfigured, STORAGE_BUCKET } from './supabaseClient';

/**
 * Servicio de Administración y Optimización de Imágenes.
 * 
 * Estrategia Arquitectónica:
 * 1. Compresión en el cliente: Redimensionamiento y conversión a WebP/JPEG mediante Canvas
 *    para reducir el peso de las imágenes entre un 70% y 90% antes de cualquier subida.
 * 2. Almacenamiento Primario: Supabase Storage -> Firestore almacena solo la URL pública.
 * 3. Almacenamiento Alternativo en Firestore (Base64 optimizado): Guarda la imagen comprimida
 *    (<350 KB) directamente en el documento de Firestore si no se dispone de bucket de Storage.
 */
export const storageService = {
  /**
   * Comprime y redimensiona una imagen en el navegador del usuario antes de enviarla.
   * @param {File} file - Archivo seleccionado por el usuario.
   * @param {Object} options - Parámetros de compresión.
   * @returns {Promise<{ blob: Blob, dataUrl: string, sizeKb: number, width: number, height: number }>}
   */
  async compressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.8, format = 'image/webp' } = {}) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Calcular escalado manteniendo relación de aspecto
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Exportar a DataURL y Blob comprimido
          const dataUrl = canvas.toDataURL(format, quality);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Error al generar blob de imagen'));
                return;
              }
              const sizeKb = Math.round(blob.size / 1024);
              resolve({ blob, dataUrl, sizeKb, width, height });
            },
            format,
            quality
          );
        };

        img.onerror = (err) => reject(err);
      };

      reader.onerror = (err) => reject(err);
    });
  },

  /**
   * Sube la imagen comprimida a Supabase Storage y retorna la URL pública HTTPS.
   * Si Supabase no está configurado o falla, hace fallback a DataURL local.
   * @param {File} file - Archivo a subir.
   * @param {string} folderPath - Carpeta dentro del bucket (por defecto 'invitaciones').
   * @returns {Promise<{ url: string, sizeKb: number, storageType: string }>}
   */
  async uploadToStorage(file, folderPath = 'invitaciones') {
    // 1. Comprimir antes de subir
    const { blob, sizeKb } = await this.compressImage(file, { maxWidth: 1400, quality: 0.82 });
    console.log(`[StorageService] Imagen optimizada: ${sizeKb} KB (antes: ${Math.round(file.size / 1024)} KB)`);

    // 2. Intentar subir a Supabase Storage (almacenamiento primario)
    if (isSupabaseConfigured && supabase) {
      try {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `${folderPath}/${fileName}`;

        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, blob, {
            contentType: blob.type,
            cacheControl: '31536000', // Caché de 1 año en CDN (en segundos)
            upsert: false
          });

        if (error) throw error;

        // Obtener URL pública del archivo subido
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(data.path);

        if (!urlData?.publicUrl) {
          throw new Error('No se pudo obtener la URL pública de Supabase');
        }

        return {
          url: urlData.publicUrl,
          sizeKb,
          storageType: 'supabase-storage'
        };
      } catch (error) {
        console.warn('[StorageService] Supabase Storage falló, alternando a modo local:', error);
      }
    }

    // 3. Fallback: DataURL local (modo demo / sin configuración)
    const { dataUrl } = await this.compressImage(file, { maxWidth: 800, quality: 0.75 });
    return {
      url: dataUrl,
      sizeKb,
      storageType: 'local-data-url'
    };
  },

  /**
   * Almacena la imagen comprimida directamente en Firestore (Base64 optimizado).
   * Aplica un estricto filtro de peso (< 350 KB) para proteger el límite de 1 MB del documento.
   * @param {string} invitationDocId - ID del documento de invitación en Firestore.
   * @param {File} file - Archivo a guardar.
   * @param {string} caption - Texto descriptivo opcional.
   * @returns {Promise<{ url: string, caption: string, uploadedAt: string, sizeKb: number }>}
   */
  async saveImageToFirestore(invitationDocId, file, caption = '') {
    // Compresión estricta para almacenamiento seguro en documento Firestore
    const { dataUrl, sizeKb } = await this.compressImage(file, { 
      maxWidth: 900, 
      maxHeight: 900, 
      quality: 0.75, 
      format: 'image/webp' 
    });

    if (sizeKb > 350) {
      throw new Error(`La imagen comprimida (${sizeKb} KB) excede el umbral recomendado para Firestore (350 KB).`);
    }

    const imageEntry = {
      url: dataUrl,
      caption: caption || file.name,
      uploadedAt: new Date().toISOString(),
      sizeKb
    };

    if (isFirebaseConfigured && db && invitationDocId) {
      try {
        const invRef = doc(db, 'invitaciones', invitationDocId);
        await updateDoc(invRef, {
          gallery: arrayUnion(imageEntry)
        });
        console.log(`[FirestoreStorage] Imagen de ${sizeKb} KB anexada a Firestore exitosamente.`);
      } catch (error) {
        console.error('[FirestoreStorage] Error al guardar en documento Firestore:', error);
        throw error;
      }
    }

    return imageEntry;
  }
};

export default storageService;