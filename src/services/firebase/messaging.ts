import {
  collection, doc, setDoc, addDoc, updateDoc, onSnapshot,
  query, orderBy, where, serverTimestamp, getDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { Conversation, Message } from '@/types/messaging';

// Genera un ID determinístico combinando ambos UIDs ordenados,
// para que la conversación entre dos usuarios sea siempre la misma
const getConversationId = (uidA: string, uidB: string): string => {
  return [uidA, uidB].sort().join('_');
};

// Crea la conversación si no existe, o la devuelve si ya existe.
// participantInfo denormaliza nombre/avatar para no tener que
// consultar el documento de cada usuario al mostrar la lista.
export const getOrCreateConversation = async (
  currentUserId: string,
  currentUserInfo: { name: string; avatarUrl?: string },
  otherUserId: string,
  otherUserInfo: { name: string; avatarUrl?: string },
): Promise<string> => {
  const conversationId = getConversationId(currentUserId, otherUserId);
  const ref = doc(db, 'conversations', conversationId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {

    const buildInfo = (info: { name: string; avatarUrl?: string }) => {
      const data: { name: string; avatarUrl?: string } = { name: info.name };
      if (info.avatarUrl) data.avatarUrl = info.avatarUrl;
      return data;
    };

    await setDoc(ref, {
      participants: [currentUserId, otherUserId],
      participantInfo: {
        [currentUserId]: buildInfo(currentUserInfo),
        [otherUserId]: buildInfo(otherUserInfo),
      },
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
    });
  }

  return conversationId;
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  text: string
): Promise<void> => {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  await addDoc(messagesRef, {
    senderId,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  });

  // Actualizamos el resumen de la conversación para que la lista
  // muestre el último mensaje sin tener que leer la subcolección completa
  await updateDoc(doc(db, 'conversations', conversationId), {
    lastMessage: text.trim(),
    lastMessageAt: new Date().toISOString(),
  });
};

// Escucha en tiempo real todas las conversaciones donde participa el usuario
export const subscribeToConversations = (
  userId: string,
  callback: (conversations: Conversation[]) => void
) => {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Conversation[];
    callback(conversations);
  }, (error) => {
    console.error('[messaging] subscribeToConversations:', error);
    callback([]);
  });
};

// Escucha en tiempo real los mensajes de una conversación, ordenados cronológicamente
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
) => {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Message[];
    callback(messages);
  }, (error) => {
    console.error('[messaging] subscribeToMessages:', error);
    callback([]);
  });
};