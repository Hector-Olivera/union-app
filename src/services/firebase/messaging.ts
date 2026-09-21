import {
  collection, doc, setDoc, addDoc, updateDoc, onSnapshot,
  query, orderBy, where, serverTimestamp, getDoc,
  arrayRemove,
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
      lastMessageAt: serverTimestamp(),
      unreadBy: [],
    });
  }

  return conversationId;
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  text: string,
  otherUserId: string,
): Promise<void> => {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  await addDoc(messagesRef, {
    senderId,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });

  // Actualizamos el resumen de la conversación para que la lista
  // muestre el último mensaje sin tener que leer la subcolección completa
  await updateDoc(doc(db, 'conversations', conversationId), {
    lastMessage: text.trim(),
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: senderId,
    unreadBy: [otherUserId],
  });
};

const timestampToISO = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value; 
};


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
    const conversations = snapshot.docs.map(d => {
      const data = d.data({ serverTimestamps: 'estimate' });
      console.log('[DEBUG] conversation', d.id, 'unreadBy:', data.unreadBy, 'lastMessage:', data.lastMessage);
      return {
        id: d.id,
        participants: data.participants,
        participantInfo: data.participantInfo,
        lastMessage: data.lastMessage,
        lastMessageSenderId: data.lastMessageSenderId,
        unreadBy: data.unreadBy || [],
        lastMessageAt: timestampToISO(data.lastMessageAt),
      } as Conversation;
    });
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
    const messages = snapshot.docs.map(d => {
      const data = d.data({ serverTimestamps: 'estimate' });
      return { id: d.id, ...data, createdAt: timestampToISO(data.createdAt) };
    }) as Message[];
    callback(messages);
  }, (error) => {
    console.error('[messaging] subscribeToMessages:', error);
    callback([]);
  });
};

export const markConversationAsRead = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  await updateDoc(doc(db, 'conversations', conversationId), {
    unreadBy: arrayRemove(userId),
  });
};