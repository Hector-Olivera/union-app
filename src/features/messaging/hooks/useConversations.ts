import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@stores/authStore';
import { subscribeToConversations } from '@services/firebase/messaging';
import type { Conversation } from '@/types/messaging';

export const useConversations = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToConversations(user.id, (data) => {
      setConversations(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.id]);

  return { conversations, loading };
};