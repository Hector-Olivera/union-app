// Este archivo solo se carga en iOS y Android.
// Metro resuelve automáticamente .native.ts sobre .ts en plataformas nativas.
// @ts-ignore — false-positive conocido de Firebase v10+ en RN
import { getReactNativePersistence, sendPasswordResetEmail } from 'firebase/auth';
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
import type { User } from '@stores/authStore';

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

      // Traemos los datos extra que solo viven en Firestore
      // (favoritos, recientes, firstName/lastName) y los combinamos
      const firestoreDoc = await getDoc(doc(db, 'players', firebaseUser.uid));
      const firestoreData = firestoreDoc.exists() ? firestoreDoc.data() : {};

      callback({
        ...baseUser,
        firstName: firestoreData.firstName,
        lastName: firestoreData.lastName,
        favorites: firestoreData.favorites || [],
        recentVisits: firestoreData.recentVisits || [],
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

export const deleteAccount = async (password: string): Promise<void> => {
  if (!auth.currentUser || !auth.currentUser.email) {
    throw new Error('No hay sesión activa');
  }

  const userId = auth.currentUser.uid;

  // Reautenticación obligatoria antes de cualquier operación destructiva
  const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
  await reauthenticateWithCredential(auth.currentUser, credential);

  // Si el usuario tiene tienda, borramos sus productos y la tienda misma
  const storeRef = doc(db, 'stores', userId);
  const productsSnap = await getDocs(collection(db, 'stores', userId, 'products'));
  await Promise.all(productsSnap.docs.map(d => deleteDoc(d.ref)));
  await deleteDoc(storeRef).catch(() => {});
  // El catch silencioso es porque deleteDoc no falla si el documento
  // no existe (usuario sin tienda) — Firestore simplemente no hace nada

  // Borramos el documento de datos del usuario
  await deleteDoc(doc(db, 'players', userId));

  // Por último, eliminamos la cuenta de autenticación en sí
  await deleteUser(auth.currentUser);
};