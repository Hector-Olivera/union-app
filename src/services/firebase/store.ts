import {
  doc, getDoc, setDoc, updateDoc,
  collection, serverTimestamp, onSnapshot
} from 'firebase/firestore';
import { db } from './config';
import type { Store, StoreSection } from '@/types/store';
import { DEFAULT_STORE_LAYOUT } from '@/types/store';

// Obtener la tienda de un usuario por su ownerId
export const getUserStore = async (userId: string): Promise<Store | null> => {
  try {
    // El storeId es el mismo que el userId para simplificar
    // Un usuario = una tienda (por ahora)
    const snap = await getDoc(doc(db, 'stores', userId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Store;
  } catch (error) {
    console.error('[store] getUserStore:', error);
    return null;
  }
};

// Crear la tienda cuando el usuario la activa por primera vez
export const createStore = async (
  userId: string,
  name: string,
): Promise<Store> => {
  const store: Omit<Store, 'id'> = {
    ownerId:     userId,
    name,
    description: '',
    themeId:     'violet',
    isPublic:    false,
    // La tienda arranca privada — el usuario la publica cuando esté lista
    createdAt:   new Date().toISOString(),
    layout:      DEFAULT_STORE_LAYOUT,
  };

  await setDoc(doc(db, 'stores', userId), store);
  return { id: userId, ...store };
};

// Actualizar campos básicos de la tienda
export const updateStore = async (
  storeId: string,
  data: Partial<Omit<Store, 'id' | 'ownerId' | 'createdAt'>>
): Promise<void> => {
  await updateDoc(doc(db, 'stores', storeId), data);
};

// Actualizar el layout (orden y visibilidad de secciones)
export const updateStoreLayout = async (
  storeId: string,
  layout: StoreSection[]
): Promise<void> => {
  await updateDoc(doc(db, 'stores', storeId), { layout });
};
export const subscribeToStore = (
  storeId: string,
  callback: (store: Store | null) => void
) => {
  const unsubscribe = onSnapshot(
    doc(db, 'stores', storeId),
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as Store);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('[store] subscribeToStore:', error);
      callback(null);
    }
  );
  return unsubscribe;
};