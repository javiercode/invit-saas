import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';

/** Protege rutas: exige sesión (y rol admin si `adminOnly`). Sin sesión redirige al login. */
export const RequireAuth = ({ children, adminOnly = false }) => {
  const { user, profile, isAdmin, isEnabled, loading } = useAuth();
  const location = useLocation();

  if (loading || (user && !profile)) return <p style={{ padding: 40, textAlign: 'center' }}>Cargando sesión...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isEnabled) {
    return <p style={{ padding: 40, textAlign: 'center' }}>Tu cuenta aún no ha sido habilitada por un administrador.</p>;
  }
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export default RequireAuth;
