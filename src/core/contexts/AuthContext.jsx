import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  isFirebaseConfigured, 
  googleAuthProvider 
} from '../firebase';
import { usersService } from '../services/usersService';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
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
      setProfile(null);
    });
  }, [user]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock user en modo de prueba local
      setUser({
        uid: 'demo-user-123',
        displayName: 'Usuario Demo',
        email: 'demo@invitaciones.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) return user;
    return signInWithPopup(auth, googleAuthProvider);
  };

  const loginWithEmail = async (email, password) => {
    if (!isFirebaseConfigured) return user;
    return signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email, password) => {
    if (!isFirebaseConfigured) return user;
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      return;
    }
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin: profile?.role === 'admin', isEnabled: Boolean(profile?.enabled), loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
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
