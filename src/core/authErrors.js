const MESSAGES = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
  'auth/unauthorized-domain': 'Dominio no autorizado en Firebase Auth (Authorized domains).',
  'auth/operation-not-allowed': 'Proveedor no habilitado en Firebase Authentication.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
  'auth/api-key-not-valid': 'La API key de Firebase no es válida.',
  'auth/not-configured': 'Firebase no está configurado en este despliegue (faltan los secrets VITE_FIREBASE_*).'
};

export const authErrorMessage = (err) =>
  MESSAGES[err?.code] || err?.message || 'Error en la autenticación.';
