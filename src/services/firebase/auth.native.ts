// Este archivo solo se carga en iOS y Android.
// Metro resuelve automáticamente .native.ts sobre .ts en plataformas nativas.
// @ts-ignore — false-positive conocido de Firebase v10+ en RN
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseApp } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  initializeAuth, sendEmailVerification, reload,
  EmailAuthProvider, reauthenticateWithCredential, updatePassword,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { User } from '@stores/authStore';

export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => ({
  id:          firebaseUser.uid,
  email:       firebaseUser.email!,
  displayName: firebaseUser.displayName || 'Jugador',
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

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      callback(await mapFirebaseUser(firebaseUser));
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