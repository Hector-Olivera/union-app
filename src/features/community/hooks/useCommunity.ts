import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@stores/authStore';
import { getUserStore } from '@services/firebase/store';
import { toggleFavorite, recordVisit, searchPublicStores } from '@services/firebase/community';
import type { StoreSummary } from '@/types/community';
import type { Store } from '@/types/store';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

const toSummary = (store: Store): StoreSummary => ({
  id: store.id,
  name: store.name,
  logoUrl: store.logoUrl,
  themeId: store.themeId,
});

export const useCommunity = () => {
  const { user, setUser } = useAuthStore();
  const [favoriteStores, setFavoriteStores] = useState<StoreSummary[]>([]);
  const [recentStores, setRecentStores] = useState<StoreSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Resuelve los IDs guardados (favoritos/recientes) a datos reales de tienda
  const loadStoreSummaries = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const favIds = user.favorites || [];
    const recentIds = (user.recentVisits || []).map(v => v.storeId);

    const [favResults, recentResults] = await Promise.all([
      Promise.all(favIds.map(id => getUserStore(id))),
      Promise.all(recentIds.map(id => getUserStore(id))),
    ]);

    setFavoriteStores(favResults.filter(Boolean).map(s => toSummary(s!)));
    setRecentStores(recentResults.filter(Boolean).map(s => toSummary(s!)));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadStoreSummaries();
  }, [loadStoreSummaries]);

  const isFavorite = (storeId: string) => (user?.favorites || []).includes(storeId);

  const toggleFav = async (storeId: string) => {
    if (!user) return;
    const currentlyFav = isFavorite(storeId);
    await toggleFavorite(user.id, storeId, currentlyFav);
    const updated = currentlyFav
      ? (user.favorites || []).filter(id => id !== storeId)
      : [...(user.favorites || []), storeId];
    setUser({ ...user, favorites: updated });
  };

  const visitStore = async (storeId: string) => {
    if (!user) return;
    const updated = await recordVisit(user.id, storeId, user.recentVisits || []);
    setUser({ ...user, recentVisits: updated });
  };

  const search = async (queryText: string) => {
    return searchPublicStores(queryText);
  };

  const removeVisit = async (storeId: string) => {
    if (!user) return;
    const updated = (user.recentVisits || []).filter(v => v.storeId !== storeId);
    await updateDoc(doc(db, 'players', user.id), { recentVisits: updated });
    setUser({ ...user, recentVisits: updated });
    setRecentStores(prev => prev.filter(s => s.id !== storeId));
  };

  return {
    favoriteStores, recentStores, loading,
    isFavorite, toggleFav, visitStore, search, removeVisit
  };
};