import {
  doc, updateDoc, arrayUnion, arrayRemove,
  collection, query, where, getDocs,
} from 'firebase/firestore';
import { db } from './config';
import type { RecentVisit } from '@/types/community';

const MAX_RECENT_VISITS = 10;

// Agrega o quita una tienda de favoritos
export const toggleFavorite = async (
  userId: string, storeId: string, isFavorite: boolean
): Promise<void> => {
  await updateDoc(doc(db, 'players', userId), {
    favorites: isFavorite ? arrayRemove(storeId) : arrayUnion(storeId),
  });
};

// Registra una visita reciente. Mantiene solo las últimas N,
// y si la tienda ya estaba en el historial, la movemos al principio
// en lugar de duplicarla.
export const recordVisit = async (
  userId: string, storeId: string, currentVisits: RecentVisit[]
): Promise<RecentVisit[]> => {
  const filtered = currentVisits.filter(v => v.storeId !== storeId);
  const updated = [{ storeId, visitedAt: new Date().toISOString() }, ...filtered]
    .slice(0, MAX_RECENT_VISITS);

  await updateDoc(doc(db, 'players', userId), { recentVisits: updated });
  return updated;
};

// Búsqueda simple del lado cliente: trae tiendas públicas y filtra
// por coincidencia de texto en el nombre. Suficiente para el volumen
// actual de tiendas 
export const searchPublicStores = async (queryText: string) => {
  const q = query(collection(db, 'stores'), where('isPublic', '==', true));
  const snap = await getDocs(q);
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  const normalized = queryText.trim().toLowerCase();
  if (!normalized) return all;

  return all.filter(store =>
    store.name.toLowerCase().includes(normalized)
  );
};