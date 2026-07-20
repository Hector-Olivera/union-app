import { useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@services/firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@services/firebase/config';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signOut();
      
      const response = await GoogleSignin.signIn();
      const idToken = (response as any).data?.idToken || (response as any).idToken;

      if (!idToken) {
        throw new Error('No se recibió el token de Google');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);

      const userDoc = await getDoc(doc(db, 'players', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'players', result.user.uid), {
          id: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'Usuario',
          avatarUrl: result.user.photoURL || null,
          createdAt: serverTimestamp(),
          level: 1,
          inventory: [],
          armor: null,
        });
      }
    } catch (e: any) {
      if (e.code === 'SIGN_IN_CANCELLED' || e.message?.includes('cancel')) {
        setError(null);
      } else {
        setError(e.message || 'Error al iniciar sesión con Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading, error };
};