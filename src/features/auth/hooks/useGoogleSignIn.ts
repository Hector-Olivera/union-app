import { useState } from 'react';

// Versión web: Google Sign-In nativo no está disponible en el navegador.
// Esta plataforma seguirá usando login por email/password únicamente,
// hasta que definamos una estrategia de login social específica para web.
export const useGoogleSignIn = () => {
  const [error] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    console.warn('[GoogleSignIn] No disponible en web todavía');
  };

  return { signInWithGoogle, loading: false, error };
};