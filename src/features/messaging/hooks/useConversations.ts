import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useBlockStore } from '@stores/blockStore';
import { subscribeToConversations } from '@services/firebase/messaging';
import type { Conversation } from '@/types/messaging';

export const useConversations = () => {
  const { user } = useAuthStore();
  const blockedIds = useBlockStore(s => s.blockedIds);
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

  const visibleConversations = useMemo(
    () => conversations.filter(c => {
      const otherId = c.participants.find(id => id !== user?.id);
      return !otherId || !blockedIds.includes(otherId);
    }),
    [conversations, blockedIds, user?.id]
  );

  return { conversations, visibleConversations, loading };
};