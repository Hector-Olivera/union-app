// Traduce los códigos de error de Firebase Auth a mensajes claros en español.
const MESSAGES: Record<string, string> = {
  'auth/network-request-failed': 'No pudimos conectarnos. Revisá tu conexión a internet e intentá de nuevo.',
  // Mismo mensaje para los tres: no revelamos si el email existe o no
  'auth/invalid-credential': 'El email o la contraseña no son correctos.',
  'auth/wrong-password': 'El email o la contraseña no son correctos.',
  'auth/user-not-found': 'El email o la contraseña no son correctos.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/weak-password': 'La contraseña es muy débil. Usá al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos e intentá de nuevo.',
  'auth/user-disabled': 'Esta cuenta fue deshabilitada.',
  'auth/operation-not-allowed': 'Este método de ingreso no está habilitado.',
  'auth/requires-recent-login': 'Por seguridad, volvé a iniciar sesión e intentá de nuevo.',
};

export const isKnownAuthError = (error: any): boolean => !!MESSAGES[error?.code];

export const getAuthErrorMessage = (error: any): string =>
  MESSAGES[error?.code] || 'Ocurrió un error inesperado. Intentá de nuevo.';