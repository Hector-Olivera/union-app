export type Conversation = {
  id: string;
  participants: string[];
  participantInfo: Record<string, { name: string; avatarUrl?: string }>;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSenderId?: string;
  unreadBy?: string[];
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
};