import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { User } from '@stores/authStore';

// Convierte el objeto FirebaseUser (que tiene 30+ campos)
// al tipo User que definimos nosotros (solo lo que necesitamos)
const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  return {
    id:          firebaseUser.uid,
    email:       firebaseUser.email!,
    displayName: firebaseUser.displayName || 'Jugador',
    avatarUrl:   firebaseUser.photoURL || undefined,
  };
};

// REGISTRO
export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  // 1. Crear cuenta en Firebase Auth
  const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

  // 2. Guardar el nombre en el perfil de Auth
  await updateProfile(firebaseUser, { displayName });

  // 3. Crear documento del jugador en Firestore
  // Esto es lo que nos permite agregar datos extra al usuario
  // (armadura, inventario, nivel) que Firebase Auth no soporta
  await setDoc(doc(db, 'players', firebaseUser.uid), {
    id:          firebaseUser.uid,
    email,
    displayName,
    createdAt:   serverTimestamp(),
    level:       1,
    inventory:   [],
    armor:       null,
  });

  return mapFirebaseUser(firebaseUser);
};

// LOGIN
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(firebaseUser);
};

// LOGOUT
export const logoutUser = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

// OBSERVER DE SESIÓN
// onAuthStateChanged se llama automáticamente cuando:
// - El usuario inicia sesión
// - El usuario cierra sesión
// - La app se abre y Firebase restaura la sesión guardada
// El callback recibe el FirebaseUser o null
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await mapFirebaseUser(firebaseUser);
      callback(user);
    } else {
      callback(null);
    }
  });
  // Devuelve una función "unsubscribe" que debemos llamar
  // cuando el componente se desmonta para evitar memory leaks
};