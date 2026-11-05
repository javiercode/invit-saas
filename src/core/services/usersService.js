import { db, isFirebaseConfigured, COLLECTIONS, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from '../firebase';

export const ROLES = { ADMIN: 'admin', USER: 'user' };

// Correos con rol administrador al registrarse por primera vez (VITE_ADMIN_EMAILS="a@x.com,b@y.com")
const adminEmails = () =>
  (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

// Respaldo en memoria cuando Firebase no está configurado
const mockUsers = [
  { uid: 'demo-user-123', email: 'demo@invitaciones.com', displayName: 'Usuario Demo', role: ROLES.ADMIN, enabled: true },
  { uid: 'cliente-demo-456', email: 'cliente@invitaciones.com', displayName: 'Cliente Demo', role: ROLES.USER, enabled: true }
];

// Compatibilidad: el rol anterior 'cliente' equivale a USER
const normalizeRole = (r) => (r === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER);

export const usersService = {
  /** Obtiene (o crea en el primer ingreso) el perfil con rol y estado del usuario autenticado. */
  async ensureProfile(user) {
    if (!isFirebaseConfigured) {
      return mockUsers.find((u) => u.uid === user.uid) || mockUsers[0];
    }
    const ref = doc(db, COLLECTIONS.USERS, user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      return { uid: user.uid, ...data, role: normalizeRole(data.role) };
    }

    // Registro previo hecho por un administrador (documento con id = correo) o admin por configuración
    const email = (user.email || '').toLowerCase();
    const preRef = email ? doc(db, COLLECTIONS.USERS, email) : null;
    const pre = preRef ? await getDoc(preRef) : null;
    const isAdmin = adminEmails().includes(email) || (pre?.exists() && pre.data().role === ROLES.ADMIN);
    const profile = {
      email: user.email || '',
      displayName: user.displayName || '',
      role: isAdmin ? ROLES.ADMIN : ROLES.USER,
      enabled: true // quien puede iniciar sesión accede a Editor y Dashboard
    };
    await setDoc(ref, profile);
    if (pre?.exists()) { try { await deleteDoc(preRef); } catch { /* sin permiso: se ignora */ } }
    return { uid: user.uid, ...profile };
  },

  async list() {
    if (!isFirebaseConfigured) return [...mockUsers];
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  },

  /** Administración: registra un correo con rol (id = correo) hasta su primer ingreso. */
  async create({ email, role = ROLES.USER }) {
    const id = email.trim().toLowerCase();
    const data = { email: id, displayName: '', role: normalizeRole(role), enabled: true };
    if (!isFirebaseConfigured) { mockUsers.push({ uid: id, ...data }); return; }
    await setDoc(doc(db, COLLECTIONS.USERS, id), data);
  },

  async remove(uid) {
    if (!isFirebaseConfigured) {
      const i = mockUsers.findIndex((x) => x.uid === uid);
      if (i >= 0) mockUsers.splice(i, 1);
      return;
    }
    await deleteDoc(doc(db, COLLECTIONS.USERS, uid));
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
