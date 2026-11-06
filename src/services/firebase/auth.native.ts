// Este archivo solo se carga en iOS y Android.
// Metro resuelve automáticamente .native.ts sobre .ts en plataformas nativas.
// @ts-ignore — false-positive conocido de Firebase v10+ en RN
import { getReactNativePersistence, sendPasswordResetEmail, GoogleAuthProvider } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseApp } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  initializeAuth, sendEmailVerification, reload, deleteUser,
  EmailAuthProvider, reauthenticateWithCredential, updatePassword,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, deleteDoc, collection, getDocs, 
  getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { reportError } from '@services/reportError';
import type { User } from '@stores/authStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { cleanUpUserData } from './accountCleanup';

export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => ({
  id:          firebaseUser.uid,
  email:       firebaseUser.email!,
  displayName: firebaseUser.displayName || 'Usuario',
  avatarUrl:   firebaseUser.photoURL || undefined,
  emailVerified: firebaseUser.emailVerified,
});

export const registerUser = async (
  email: string, password: string, displayName: string
): Promise<User> => {
  const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(firebaseUser, { displayName });

  await sendEmailVerification(firebaseUser);

  await setDoc(doc(db, 'players', firebaseUser.uid), {
    id: firebaseUser.uid, email, displayName,
    createdAt: serverTimestamp(), level: 1, inventory: [], armor: null,
  });
  return mapFirebaseUser(firebaseUser);
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(firebaseUser);
};

export const logoutUser = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const baseUser = await mapFirebaseUser(firebaseUser);

      let firestoreData: Record<string, any> = {};
      try {
        const firestoreDoc = await getDoc(doc(db, 'players', firebaseUser.uid));
        if (firestoreDoc.exists()) firestoreData = firestoreDoc.data();
      } catch (e) {
        console.error('[auth] no se pudieron cargar los datos del usuario:', e);
        reportError(e, 'auth-load-user');
      }

      callback({
        ...baseUser,
        firstName: firestoreData.firstName,
        lastName: firestoreData.lastName,
        favorites: firestoreData.favorites || [],
        recentVisits: firestoreData.recentVisits || [],
        termsAcceptedVersion: firestoreData.termsAcceptedVersion,
      });
    } else {
      callback(null);
    }
  });
};

export const sendVerificationEmail = async (): Promise<void> => {
  if (!auth.currentUser) return;
  await sendEmailVerification(auth.currentUser);
};

// Recarga el usuario desde Firebase y devuelve el User actualizado.
// Necesario porque emailVerified se actualiza en el servidor cuando
// el usuario hace click en el link del mail, pero el cliente no se
// entera hasta que forzamos un reload().
export const reloadCurrentUser = async (): Promise<User | null> => {
  if (!auth.currentUser) return null;
  await reload(auth.currentUser);
  return mapFirebaseUser(auth.currentUser);
};

export const updateUserProfile = async (
  userId: string,
  data: { firstName: string; lastName: string; displayName: string; avatarUrl?: string }
): Promise<void> => {
  // Actualiza tanto Firestore (fuente de verdad de nuestros datos extra)
  // como el perfil de Firebase Auth (displayName y photoURL nativos)
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: data.displayName,
      photoURL: data.avatarUrl || null,
    });
  }

   const firestoreData: Record<string, any> = {
    firstName: data.firstName,
    lastName: data.lastName,
    displayName: data.displayName,
  };
  if (data.avatarUrl !== undefined) {
    firestoreData.avatarUrl = data.avatarUrl;
  }

  await setDoc(doc(db, 'players', userId), firestoreData, { merge: true });
};

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  if (!auth.currentUser || !auth.currentUser.email) {
    throw new Error('No hay sesión activa');
  }
  // Firebase exige reautenticación reciente antes de cambiar la contraseña
  // por seguridad — no se puede cambiar solo con la sesión activa
  const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updatePassword(auth.currentUser, newPassword);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const hasPasswordProvider = (): boolean =>
  !!auth.currentUser?.providerData.some(p => p.providerId === 'password');

export const deleteAccount = async (password?: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No hay sesión activa');

  if (hasPasswordProvider()) {
    if (!password) {
      throw Object.assign(new Error('Se necesita la contraseña'), { code: 'app/requires-password' });
    }
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
  } else {
    // Cuenta de Google: se reautentica eligiendo la cuenta otra vez.
    // configure() va acá porque este código puede ejecutarse sin haber pasado
    // nunca por la pantalla de login en esta sesión de la app.
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
    });
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();
    const response = await GoogleSignin.signIn();
    const idToken = (response as any).data?.idToken || (response as any).idToken;
    if (!idToken) throw new Error('No se recibió el token de Google');
    await reauthenticateWithCredential(user, GoogleAuthProvider.credential(idToken));
  }

  await cleanUpUserData(user.uid);
  await deleteUser(user);
};