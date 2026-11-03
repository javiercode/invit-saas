const DEMO_USER = {
  uid: 'demo-user-123',
  displayName: 'Usuario Demo',
  email: 'demo@invitaciones.com',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
};

/** Sesión simulada solo en desarrollo local sin Firebase; en producción (GitHub Pages) nunca hay sesión falsa. */
export const getDemoUser = (isConfigured, isDev) => (!isConfigured && isDev ? DEMO_USER : null);
