import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authErrorMessage } from '../../../core/authErrors';
import { LogIn, Sparkles, MessageCircle, Send, X } from 'lucide-react';
import './LoginPage.css';

export const LoginPage = () => {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const dialogRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestText, setRequestText] = useState(
    'Hola, solicito acceso a la plataforma para administrar mis eventos con tarjetas virtuales.'
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isModalOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    const phoneNumber = '+59162544875';
    const whatsappUrl = `https://wa.me/+59162544875/?text=${encodeURIComponent(requestText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-header">
          <span className="login-badge">
            <Sparkles size={14} />
            <span>Acceso Clientes</span>
          </span>
          <h2>Bienvenido de Nuevo</h2>
          <p>Ingresa para administrar tus eventos y respuestas RSVP.</p>
        </div>

        {error && <div className="login-error-banner">{error}</div>}

        <button
          type="button"
          className="btn-google"
          onClick={() => setIsModalOpen(true)}
        >
          <MessageCircle size={18} />
          <span>Solicitar acceso al +591 62544875</span>
        </button>

        <div className="login-separator">
          <span>o con correo electrónico</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label>Correo Electrónico</label>
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit-auth">
            <LogIn size={18} />
            <span>Iniciar Sesión</span>
          </button>
        </form>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setIsModalOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setIsModalOpen(false);
        }}
        style={{
          position: 'fixed',
          inset: 0,
          margin: 'auto',
          border: 'none',
          padding: '1rem',
          background: 'transparent',
          maxWidth: '100vw',
          maxHeight: '100vh',
          overflow: 'visible'
        }}
      >
        <div className="login-card">
          <div className="login-header">
            <span className="login-badge">
              <MessageCircle size={14} />
              <span>Contacto Directo</span>
            </span>
            <h2>Solicitar Acceso</h2>
            <p>
              Escribe tu mensaje para enviarlo al <strong>+591 62544875</strong> y habilitar tu cuenta para administrar eventos por tarjetas virtuales.
            </p>
          </div>

          <form onSubmit={handleSendRequest} className="login-form">
            <div className="form-field">
              <label>Tu Mensaje</label>
              <textarea
                rows={4}
                required
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="Escribe tus datos o detalles de tu evento..."
              />
            </div>

            <button type="submit" className="btn-submit-auth">
              <Send size={18} />
              <span>Enviar Solicitud</span>
            </button>

            <button
              type="button"
              className="btn-google"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={18} />
              <span>Cancelar</span>
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default LoginPage;
