import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@stores/authStore';
import { getUserStore } from '@services/firebase/store';
import { toggleFavorite, recordVisit, searchPublicStores } from '@services/firebase/community';
import type { StoreSummary } from '@/types/community';
import type { Store } from '@/types/store';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  subscribeToStore, getRecentPublicStores, getUnvisitedStoresWithNews
 } from '@services/firebase/store';
import { db } from '@/services/firebase/config';

export const useCommunity = () => {
  const { user, setUser } = useAuthStore();
  const [favoriteStores, setFavoriteStores] = useState<StoreSummary[]>([]);
  const [recentStores, setRecentStores] = useState<StoreSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const toSummaryWithNews = (store: Store): StoreSummary => {
    const latestAnnouncement = (store.announcements || [])[0];
    const lastVisit = (user?.recentVisits || []).find(v => v.storeId === store.id);
    const isUnseen = !!latestAnnouncement &&
    (!lastVisit || latestAnnouncement.createdAt > lastVisit.visitedAt);

    return {
      id: store.id,
      name: store.name,
      logoUrl: store.logoUrl,
      themeId: store.themeId,
      hasAnnouncement: !!latestAnnouncement,
      isAnnouncementUnseen: isUnseen,
      latestAnnouncementText: latestAnnouncement?.text,
    };
  };

  const favIds = user?.favorites || [];
  const recentIds = (user?.recentVisits || []).map(v => v.storeId);

  const favIdsKey = favIds.join(',');
  const recentIdsKey = recentIds.join(',');

  useEffect(() => {
    if (!user) {
      setFavoriteStores([]);
      setRecentStores([]);
      setLoading(false);
      return;
    }

  const allIds = [...new Set([...favIds, ...recentIds])];

  if (allIds.length === 0) {
    setFavoriteStores([]);
    setRecentStores([]);
    setLoading(false);
    return;
  }

  setLoading(true);
  const storesMap = new Map<string, Store>();
  let receivedCount = 0;

  const unsubscribes = allIds.map(id =>
    subscribeToStore(id, (store) => {
      if (store) storesMap.set(id, store);
      receivedCount++;

      const allStores = Array.from(storesMap.values());
      setFavoriteStores(
        allStores.filter(s => favIds.includes(s.id)).map(toSummaryWithNews)
      );
      setRecentStores(
        allStores.filter(s => recentIds.includes(s.id)).map(toSummaryWithNews)
      );

      if (receivedCount >= allIds.length) setLoading(false);
    })
  );

  return () => unsubscribes.forEach(unsub => unsub());
}, [user?.id, favIdsKey, recentIdsKey]);
 


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

  const storesWithNews = [...favoriteStores, ...recentStores]
  .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)
  .filter(s => s.hasAnnouncement);


  const [newStores, setNewStores] = useState<Store[]>([]);
  const [unvisitedNewsStores, setUnvisitedNewsStores] = useState<Store[]>([]);

  useEffect(() => {
    getRecentPublicStores(30).then(setNewStores);
  }, []);

  useEffect(() => {
    if (!user) return;
    const visitedIds = (user.recentVisits || []).map(v => v.storeId);
    const excludeIds = [...visitedIds, ...(user.favorites || [])];
    getUnvisitedStoresWithNews(excludeIds).then(setUnvisitedNewsStores);
  }, [user?.recentVisits, user?.favorites]);

  return {
    favoriteStores, recentStores, loading,
    isFavorite, toggleFav, visitStore, search, removeVisit, storesWithNews,
    newStores, unvisitedNewsStores
  };
};