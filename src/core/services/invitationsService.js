import { 
  db, 
  isFirebaseConfigured, 
  COLLECTIONS,
  collection,
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  setDoc,
  updateDoc,
  serverTimestamp 
} from '../firebase';
import { MOCK_INVITATIONS, MOCK_SERVICES } from './mockData';

// Copia mutable para el modo sin Firebase
const mockRsvps = [];
const mockStore = Object.values(MOCK_INVITATIONS).map((i) => ({ ...i }));

/**
 * Servicio de Invitaciones conectado a Firestore con respaldo en memoria.
 */
export const invitationsService = {
  /**
   * Obtiene una invitación por su slug amigable (ej: "j-m-2024" o "boda-juan-y-maria")
   */
  async getBySlug(slug) {
    if (!slug) return null;

    if (isFirebaseConfigured) {
      try {
        const q = query(
          collection(db, COLLECTIONS.INVITATIONS),
          where('slug', '==', slug)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          return { id: querySnapshot.docs[0].id, ...docData };
        }
      } catch (error) {
        console.warn('Error al consultar Firestore, usando respaldo local:', error);
      }
    }

    // Fallback a los datos mockeados si Firebase no está activo o no se encontró
    return MOCK_INVITATIONS[slug] || null;
  },

  /**
   * Lista las invitaciones visibles para un perfil: el administrador ve todas;
   * el cliente solo las propias que el administrador dejó habilitadas.
   */
  async listForUser(profile) {
    if (!profile) return [];
    const isAdmin = profile.role === 'admin';

    if (isFirebaseConfigured) {
      const col = collection(db, COLLECTIONS.INVITATIONS);
      const q = isAdmin ? col : query(col, where('ownerId', '==', profile.uid));
      const snap = await getDocs(q);
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return isAdmin ? all : all.filter((i) => i.enabled !== false);
    }
    return mockStore.filter((i) => isAdmin || (i.ownerId === profile.uid && i.enabled !== false));
  },

  /** Crea o actualiza una invitación (el id del documento es el slug). */
  async save(invitation) {
    const id = invitation.slug || invitation.id;
    const data = { ...invitation, id, slug: id };
    if (data.ownerId) data.userId = data.ownerId; // las reglas de Firestore validan userId
    if (isFirebaseConfigured) {
      await setDoc(doc(db, COLLECTIONS.INVITATIONS, id), data, { merge: true });
    } else {
      const idx = mockStore.findIndex((i) => i.id === id);
      if (idx >= 0) mockStore[idx] = { ...mockStore[idx], ...data };
      else mockStore.push(data);
    }
    return data;
  },

  /** Administración: habilita/deshabilita o reasigna una invitación a un usuario. */
  async update(id, patch) {
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, COLLECTIONS.INVITATIONS, id), patch);
    } else {
      const inv = mockStore.find((i) => i.id === id);
      if (inv) Object.assign(inv, patch);
    }
  },

  /**
   * Registra una confirmación de asistencia (RSVP) en la subcolección o colección de Firestore
   */
  async submitRsvp(invitationId, rsvpData, guestId = null) {
    const payload = {
      ...rsvpData,
      invitationId,
      status: 'responded',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured) {
      try {
        // Invitado pre-registrado: se completa su documento en lugar de crear uno nuevo
        if (guestId) {
          await setDoc(doc(db, COLLECTIONS.RSVPS, guestId), payload, { merge: true });
          return { success: true, id: guestId };
        }
        const docRef = await addDoc(collection(db, COLLECTIONS.RSVPS), {
          ...payload,
          serverTimestamp: serverTimestamp()
        });
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error('Error al guardar RSVP en Firestore:', error);
        throw error;
      }
    }

    // Guardado simulado para entorno demo/local
    console.log('[MOCK RSVP SUBMISSION]', payload);
    return { success: true, id: `mock-${Date.now()}` };
  },

  /** Lista las confirmaciones (y invitados pendientes) de una invitación. */
  async listRsvps(invitationId) {
    if (!isFirebaseConfigured) return mockRsvps.filter((r) => r.invitationId === invitationId);
    const q = query(collection(db, COLLECTIONS.RSVPS), where('invitationId', '==', invitationId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Pre-registra un invitado (nombre y teléfono); queda pendiente de respuesta. */
  async addGuest(invitationId, { name, phone = '' }) {
    const guest = { invitationId, name: name.trim(), phone: phone.trim(), status: 'pending', createdAt: new Date().toISOString() };
    if (isFirebaseConfigured) {
      const ref = await addDoc(collection(db, COLLECTIONS.RSVPS), guest);
      return { id: ref.id, ...guest };
    }
    const mock = { id: `mock-${Date.now()}`, ...guest };
    mockRsvps.push(mock);
    return mock;
  },

  /** Obtiene un invitado pre-registrado (para prellenar el formulario del RSVP). */
  async getGuest(guestId) {
    if (!guestId) return null;
    if (isFirebaseConfigured) {
      const snap = await getDoc(doc(db, COLLECTIONS.RSVPS, guestId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    }
    return mockRsvps.find((r) => r.id === guestId) || null;
  },

  /**
   * Obtiene todos los servicios/paquetes del catálogo
   */
  async getCatalogServices() {
    if (isFirebaseConfigured) {
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.SERVICES));
        if (!snapshot.empty) {
          return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (error) {
        console.warn('Error al cargar servicios de Firestore, usando mock:', error);
      }
    }
    return MOCK_SERVICES;
  }
};
