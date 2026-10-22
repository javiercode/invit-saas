import React, { useState } from 'react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, Sparkles } from 'lucide-react';
import './LoginPage.css';

export const LoginPage = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error en la autenticación.');
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error con Google Auth.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-header">
          <span className="login-badge">
            <Sparkles size={14} />
            <span>Acceso Clientes</span>
          </span>
          <h2>{isRegister ? 'Crear Cuenta' : 'Bienvenido de Nuevo'}</h2>
          <p>
            {isRegister
              ? 'Empieza a diseñar tus invitaciones de forma sencilla.'
              : 'Ingresa para administrar tus eventos y respuestas RSVP.'}
          </p>
        </div>

        {error && <div className="login-error-banner">{error}</div>}

        <button type="button" className="btn-google" onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuar con Google</span>
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
            <span>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
          </button>
        </form>

        <div className="toggle-auth-mode">
          {isRegister ? (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => setIsRegister(false)}>
                Inicia sesión aquí
              </button>
            </p>
          ) : (
            <p>
              ¿No tienes cuenta aún?{' '}
              <button type="button" onClick={() => setIsRegister(true)}>
                Regístrate gratis
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
