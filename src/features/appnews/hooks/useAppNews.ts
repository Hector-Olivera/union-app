import { useState, useEffect } from 'react';
import { useAuthStore } from '@stores/authStore';
import { subscribeToAppNews } from '@services/firebase/appNews';
import type { AppNewsItem } from '@/types/appNews';

export const useAppNews = () => {
  const userId = useAuthStore(s => s.user?.id);
  const [items, setItems] = useState<AppNewsItem[]>([]);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }
    return subscribeToAppNews(setItems);
  }, [userId]);

  return { items };
};