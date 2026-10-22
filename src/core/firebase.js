import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Configuración de Firebase leída desde variables de entorno seguras de Vite.
 * Para producción o desarrollo, definir estas variables en el archivo .env
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DEMO123456'
};

// Determinar si Firebase está configurado con credenciales válidas
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key'
);

// Inicialización de la aplicación (Singleton)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Servicios principales de Firebase
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Nombres y referencias de las colecciones de Firestore según la arquitectura de datos:
 * - usuarios: Perfiles de clientes y administradores
 * - servicios: Catálogo de paquetes/servicios (Bodas, XV años, Bautizos, etc.)
 * - invitaciones: Documentos con la metadata, slug, id de plantilla y JSON de personalización
 * - rsvp: Confirmaciones de asistencia asociadas a cada invitación
 */
export const COLLECTIONS = {
  USERS: 'usuarios',
  SERVICES: 'servicios',
  INVITATIONS: 'invitaciones',
  RSVPS: 'confirmaciones_rsvp'
};

// Helpers tipados para colecciones
export const usersRef = collection(db, COLLECTIONS.USERS);
export const servicesRef = collection(db, COLLECTIONS.SERVICES);
export const invitationsRef = collection(db, COLLECTIONS.INVITATIONS);

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  ref,
  uploadBytes,
  getDownloadURL
};
