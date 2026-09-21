import { useState, useEffect } from 'react';
import { useAuthStore } from '@stores/authStore';
import { subscribeToMessages, sendMessage } from '@services/firebase/messaging';
import type { Message } from '@/types/messaging';

export const useChat = (conversationId: string | undefined) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToMessages(conversationId, (data) => {
      setMessages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [conversationId]);

  const send = async (text: string, otherUserId: string) => {
    if (!conversationId || !user || !text.trim()) return;
    await sendMessage(conversationId, user.id, text, otherUserId);
  };

  return { messages, loading, send, currentUserId: user?.id };
};