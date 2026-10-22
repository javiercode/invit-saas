import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { storageService } from '../../../../core/services/storageService';
import './ImageUploader.css';

export const ImageUploader = ({
  onImageUploaded,
  storageMode = 'storage', // 'storage' (Supabase Storage) o 'firestore' (Base64 comprimido)
  label = "Subir Fotografía",
  invitationId = null,
  temporary = false // simulador: la imagen solo vive en memoria, sin subir a ningún storage
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const originalSizeKb = Math.round(file.size / 1024);

      if (temporary) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        if (onImageUploaded) onImageUploaded(url, { url, sizeKb: originalSizeKb, storageType: 'temporal' });
      } else if (storageMode === 'firestore') {
        // Modo Firestore: Comprime y guarda Base64 liviano
        const imageResult = await storageService.saveImageToFirestore(invitationId, file);
        setPreview(imageResult.url);
        setStats({
          originalKb: originalSizeKb,
          compressedKb: imageResult.sizeKb,
          savedPercent: Math.round(((originalSizeKb - imageResult.sizeKb) / originalSizeKb) * 100)
        });
        if (onImageUploaded) {
          onImageUploaded(imageResult.url, imageResult);
        }
      } else {
        // Modo Supabase Storage (Recomendado)
        const uploadResult = await storageService.uploadToStorage(file, `invitaciones/${invitationId || 'temp'}`);
        setPreview(uploadResult.url);
        setStats({
          originalKb: originalSizeKb,
          compressedKb: uploadResult.sizeKb,
          savedPercent: Math.round(((originalSizeKb - uploadResult.sizeKb) / originalSizeKb) * 100)
        });
        if (onImageUploaded) {
          onImageUploaded(uploadResult.url, uploadResult);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al procesar y subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-uploader-card">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div
        className={`uploader-dropzone ${uploading ? 'uploading' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="uploader-preview-box">
            <img src={preview} alt="Vista previa" className="uploader-thumbnail" />
            <div className="uploader-overlay">
              <UploadCloud size={20} />
              <span>Cambiar imagen</span>
            </div>
          </div>
        ) : (
          <div className="uploader-prompt">
            {uploading ? (
              <>
                <Loader2 size={32} className="spin-icon text-gold" />
                <span className="uploader-title">Optimizando y subiendo...</span>
                <span className="uploader-hint">Redimensionando con Canvas a WebP</span>
              </>
            ) : (
              <>
                <div className="uploader-icon-wrap">
                  <ImageIcon size={28} />
                </div>
                <span className="uploader-title">{label}</span>
                <span className="uploader-hint">
                  {storageMode === 'firestore'
                    ? 'Modo Firestore: Se optimizará a < 250 KB automáticamente'
                    : 'Modo Storage: Subida en alta calidad con compresión WebP'}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="uploader-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {stats && (
        <div className="uploader-stats-badge">
          <Sparkles size={14} className="text-gold" />
          <span>
            Reducción del <strong>{stats.savedPercent}%</strong> ({stats.originalKb} KB → {stats.compressedKb} KB)
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
