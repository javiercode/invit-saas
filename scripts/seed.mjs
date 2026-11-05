// Seeder de Firebase: crea el primer administrador en Authentication y su perfil en la colección `usuarios`.
// Uso: npm run seed   (lee VITE_FIREBASE_* de .env; requiere Correo/contraseña habilitado en Firebase Auth)
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const env = process.env;
const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID
});
const auth = getAuth(app);
const db = getFirestore(app);

export const SEED_USERS = [
  { email: 'javier.elvis.code@gmail.com', password: '12345678', role: 'admin', displayName: 'Javier (Administrador)' }
];

for (const { email, password, role, displayName } of SEED_USERS) {
  let cred;
  try {
    cred = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    if (e.code !== 'auth/email-already-in-use') throw e;
    cred = await signInWithEmailAndPassword(auth, email, password);
  }
  await setDoc(doc(db, 'usuarios', cred.user.uid), { email, displayName, role, enabled: true });
  console.log(`✔ ${email} (${role.toUpperCase()}) -> usuarios/${cred.user.uid}`);
}
process.exit(0);
