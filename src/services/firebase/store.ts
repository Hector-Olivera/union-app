import {
  doc, getDoc, setDoc, updateDoc,
  query, where, getDocs, limit,
  collection, serverTimestamp, onSnapshot
} from 'firebase/firestore';
import { db } from './config';
import type { 
  Store, StoreSection,
  BusinessHours, TodoItem, Announcement
 } from '@/types/store';
import { DEFAULT_STORE_LAYOUT } from '@/types/store';

// Función auxiliar: asegura que el layout tenga todas las secciones conocidas,
// agregando las que falten (de tiendas creadas antes de este cambio) sin
// tocar las que el usuario ya configuró.
const ensureCompleteLayout = (store: Store): Store => {
  const existingTypes = new Set(store.layout.map(s => s.type));
  const missingSections = DEFAULT_STORE_LAYOUT.filter(s => !existingTypes.has(s.type));
  const withCompleteLayout = {
    ...store,
    layout: [...store.layout, ...missingSections],
  };
  
  return filterExpiredAnnouncements(withCompleteLayout);
};

// Obtener la tienda de un usuario por su ownerId
export const getUserStore = async (userId: string): Promise<Store | null> => {
  try {
    // El storeId es el mismo que el userId para simplificar
    // Un usuario = una tienda (por ahora)
    const snap = await getDoc(doc(db, 'stores', userId));
    if (!snap.exists()) return null;
    return ensureCompleteLayout({ id: snap.id, ...snap.data() } as Store);
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
        callback(ensureCompleteLayout({ id: snap.id, ...snap.data() } as Store));
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

// Actualiza los horarios de atención completos
export const updateBusinessHours = async (
  storeId: string,
  businessHours: BusinessHours
): Promise<void> => {
  await setDoc(doc(db, 'stores', storeId), { businessHours }, { merge: true });
};

// Reescribe la lista completa de pendientes.
// Simple y confiable para listas chicas — evita la complejidad
// de arrayUnion/arrayRemove con objetos (que requieren coincidencia exacta).
export const updateTodos = async (
  storeId: string,
  todos: TodoItem[]
): Promise<void> => {
  await setDoc(doc(db, 'stores', storeId), { todos }, { merge: true });
};

// Reescribe la lista completa de novedades
export const updateAnnouncements = async (
  storeId: string,
  announcements: Announcement[]
): Promise<void> => {
  await setDoc(doc(db, 'stores', storeId), { announcements }, { merge: true });
};

const ANNOUNCEMENT_LIFETIME_HOURS = 36;

// Filtra las novedades vencidas (más de 36hs) y, si encontró alguna
// vencida, actualiza el documento en Firestore para persistir el borrado
// en todos lados que lean esta tienda — no solo en memoria local.
export const pruneExpiredAnnouncements = async (store: Store): Promise<Store> => {
  const now = Date.now();
  const validAnnouncements = (store.announcements || []).filter(a => {
    const ageHours = (now - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
    return ageHours < ANNOUNCEMENT_LIFETIME_HOURS;
  });

  const hadExpired = validAnnouncements.length !== (store.announcements || []).length;

  if (hadExpired) {
    await updateStore(store.id, { announcements: validAnnouncements });
  }

  return { ...store, announcements: validAnnouncements };
};

// Filtra en MEMORIA las novedades vencidas, sin escribir nada.
// Cualquier usuario (dueño o visitante) puede usar esto de forma segura
// al leer una tienda — nunca intenta persistir el cambio.
export const filterExpiredAnnouncements = (store: Store): Store => {
  const now = Date.now();
  const validAnnouncements = (store.announcements || []).filter(a => {
    const ageHours = (now - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
    return ageHours < ANNOUNCEMENT_LIFETIME_HOURS;
  });
  return { ...store, announcements: validAnnouncements };
};

// Persiste el borrado en Firestore — SOLO debe llamarse cuando
// el usuario actual es el dueño de la tienda (ej: desde el dashboard).
// Si se llama sin ser dueño, las reglas de seguridad la rechazan,
// como corresponde.
export const pruneExpiredAnnouncementsIfOwner = async (store: Store, currentUserId?: string): Promise<Store> => {
  const filtered = filterExpiredAnnouncements(store);
  const hadExpired = filtered.announcements?.length !== (store.announcements || []).length;

  if (hadExpired && currentUserId === store.ownerId) {
    await updateStore(store.id, { announcements: filtered.announcements });
  }

  return filtered;
};

export const getPublicStoreByOwner = async (ownerId: string): Promise<Store | null> => {
  const q = query(
    collection(db, 'stores'),
    where('ownerId', '==', ownerId),
    where('isPublic', '==', true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Store;
};

// Tiendas públicas creadas en los últimos N días, más nuevas primero
export const getRecentPublicStores = async (days: number = 30): Promise<Store[]> => {
  const q = query(collection(db, 'stores'), where('isPublic', '==', true));
  const snap = await getDocs(q);
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Store))
    .filter(s => new Date(s.createdAt).getTime() > cutoff)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Tiendas públicas con novedades vigentes, excluyendo las que el usuario
// ya visitó (favoritas o recientes) — para el feed "Te enteraste??"
export const getUnvisitedStoresWithNews = async (excludeIds: string[]): Promise<Store[]> => {
  const q = query(collection(db, 'stores'), where('isPublic', '==', true));
  const snap = await getDocs(q);

  return snap.docs
    .map(d => filterExpiredAnnouncements({ id: d.id, ...d.data() } as Store))
    .filter(s => !excludeIds.includes(s.id) && (s.announcements || []).length > 0);
};