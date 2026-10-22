import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FlaskConical, Sparkles, LayoutDashboard, Compass, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  // Ocultar Navbar estándar si estamos viendo una invitación en vivo (/invitacion/:slug)
  if (location.pathname.startsWith('/invitacion/')) {
    return null;
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💌</span>
          <span className="brand-text">
            Invita<span className="brand-gold">SaaS</span>
          </span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/catalogo"
            className={`nav-link ${location.pathname === '/catalogo' ? 'active' : ''}`}
          >
            <Compass size={16} />
            <span>Catálogo</span>
          </Link>
          <Link
            to="/simulador"
            className={`nav-link ${location.pathname === '/simulador' ? 'active' : ''}`}
          >
            <FlaskConical size={16} />
            <span>Simulador</span>
          </Link>
          {user && (
            <>
              <Link to="/builder" className={`nav-link ${location.pathname === '/builder' ? 'active' : ''}`}>
                <Sparkles size={16} />
                <span>Editor</span>
              </Link>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
              <ShieldCheck size={16} />
              <span>Administración</span>
            </Link>
          )}
        </div>

        <div className="navbar-cta">
          {user ? (
            <button type="button" className="btn-login" onClick={logout}>
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          ) : (
            <Link to="/login" className="btn-login">
              <LogIn size={16} />
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
