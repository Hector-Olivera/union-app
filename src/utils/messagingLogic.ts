import type { Conversation } from '@/types/messaging';

// Determina si una conversación tiene mensajes sin leer para un usuario dado.
// Función pura: mismo input siempre da mismo output, sin efectos secundarios.
export const isConversationUnread = (
  conversation: Pick<Conversation, 'unreadBy'>,
  currentUserId: string
): boolean => {
  return (conversation.unreadBy || []).includes(currentUserId);
};

// Determina si, en este momento, corresponde marcar la conversación como leída.
// Solo debe ocurrir si la pantalla está en foco Y hay una conversación real.
export const shouldMarkAsRead = (
  conversationId: string | undefined,
  currentUserId: string | undefined,
  isFocused: boolean
): boolean => {
  return !!conversationId && !!currentUserId && isFocused;
};