import { db, isFirebaseConfigured, COLLECTIONS, collection, doc, getDoc, getDocs, setDoc, updateDoc } from '../firebase';

export const ROLES = { ADMIN: 'admin', CLIENT: 'cliente' };

// Correos con rol administrador al registrarse por primera vez (VITE_ADMIN_EMAILS="a@x.com,b@y.com")
const adminEmails = () =>
  (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

// Respaldo en memoria cuando Firebase no está configurado
const mockUsers = [
  { uid: 'demo-user-123', email: 'demo@invitaciones.com', displayName: 'Usuario Demo', role: ROLES.ADMIN, enabled: true },
  { uid: 'cliente-demo-456', email: 'cliente@invitaciones.com', displayName: 'Cliente Demo', role: ROLES.CLIENT, enabled: true }
];

export const usersService = {
  /** Obtiene (o crea en el primer ingreso) el perfil con rol y estado del usuario autenticado. */
  async ensureProfile(user) {
    if (!isFirebaseConfigured) {
      return mockUsers.find((u) => u.uid === user.uid) || mockUsers[0];
    }
    const ref = doc(db, COLLECTIONS.USERS, user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return { uid: user.uid, ...snap.data() };

    const isAdmin = adminEmails().includes((user.email || '').toLowerCase());
    const profile = {
      email: user.email || '',
      displayName: user.displayName || '',
      role: isAdmin ? ROLES.ADMIN : ROLES.CLIENT,
      enabled: isAdmin // los clientes deben ser habilitados por un administrador
    };
    await setDoc(ref, profile);
    return { uid: user.uid, ...profile };
  },

  async list() {
    if (!isFirebaseConfigured) return [...mockUsers];
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  },

  async update(uid, patch) {
    if (!isFirebaseConfigured) {
      const u = mockUsers.find((x) => x.uid === uid);
      if (u) Object.assign(u, patch);
      return;
    }
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), patch);
  }
};

export default usersService;
