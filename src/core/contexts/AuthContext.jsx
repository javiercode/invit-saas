import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  isFirebaseConfigured, 
  googleAuthProvider 
} from '../firebase';
import { getDemoUser } from '../demoUser';
import { usersService } from '../services/usersService';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga el perfil (rol y habilitación) de Firestore al cambiar la sesión
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    usersService.ensureProfile(user).then(setProfile).catch((e) => {
      console.error('Error al cargar el perfil:', e);
      setProfile({ role: 'user', enabled: false }); // evita quedarse cargando

    });
  }, [user]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Usuario simulado solo en desarrollo local (en producción: sin sesión)
      setUser(getDemoUser(isFirebaseConfigured, import.meta.env.DEV));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sin Firebase: en dev usa la sesión demo; en producción falla con un error claro
  const requireConfigured = () => {
    if (isFirebaseConfigured || import.meta.env.DEV) return;
    throw Object.assign(new Error('Firebase no configurado'), { code: 'auth/not-configured' });
  };

  const loginWithGoogle = async () => {
    requireConfigured();
    if (!isFirebaseConfigured) return user;
    return signInWithPopup(auth, googleAuthProvider);
  };

  const loginWithEmail = async (email, password) => {
    requireConfigured();
    if (!isFirebaseConfigured) return user;
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      return;
    }
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin: profile?.role === 'admin', isEnabled: profile?.enabled !== false, loading, loginWithGoogle, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
