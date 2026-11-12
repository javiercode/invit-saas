import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/invitacion/')) {
    return null;
  }

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-icon">💌</span>
          <span className="brand-title">InvitaSaaS</span>
          <p className="brand-desc">
            Plataforma SaaS de invitaciones interactivas de bodas y eventos en tiempo real.
          </p>
        </div>

        <div className="footer-links">
          <h4>Plataforma</h4>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/builder">Constructor</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <div className="footer-links">
          <h4>Plantillas</h4>
          <Link to="/invitacion/j-m-2024">Colección Elegante</Link>
          <Link to="/invitacion/boda-juan-y-maria">Colección Vintage</Link>
          <Link to="/builder?template=moderna">Colección Moderna</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Hecho con <Heart size={14} className="heart-inline" /> para celebrar tus mejores momentos.
          Compatible con GitHub Pages y Firebase.
        </p>
        <p>
          Diseñado por <a href="https://tekforge.ia.bo/" target="_blank" rel="noreferrer">TekForge</a>
          {' · '}Contacto directo:{' '}
          <a href="https://wa.me/59162544875" target="_blank" rel="noreferrer">+591 62544875</a> (Administrador)
        </p>
      </div>
    </footer>
  );
};

export default Footer;
