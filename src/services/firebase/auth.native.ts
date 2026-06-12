// Este archivo solo se carga en iOS y Android.
// Metro resuelve automáticamente .native.ts sobre .ts en plataformas nativas.
import { initializeAuth } from 'firebase/auth';
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
});

export const registerUser = async (
  email: string, password: string, displayName: string
): Promise<User> => {
  const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(firebaseUser, { displayName });
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