import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Conversation } from '@/types/messaging';

type Props = {
  conversation: Conversation;
  currentUserId: string;
};

const formatRelativeTime = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} h`;
  return `${days} sem`;
};

export const ConversationListItem = ({ conversation, currentUserId }: Props) => {
  // El "otro" participante — el que no soy yo
  const otherUserId = conversation.participants.find(id => id !== currentUserId);
  const otherInfo = otherUserId ? conversation.participantInfo[otherUserId] : null;

  if (!otherInfo) return null;

  const initial = otherInfo.name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/(app)/chat/${conversation.id}` as any)}
      activeOpacity={0.75}
    >
      {otherInfo.avatarUrl ? (
        <Image source={{ uri: otherInfo.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{otherInfo.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {conversation.lastMessage || 'Nueva conversación'}
        </Text>
      </View>

      <Text style={styles.time}>{formatRelativeTime(conversation.lastMessageAt)} </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarPlaceholder: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitial: { color: '#fff', fontSize: 18, fontWeight: '900' },
  info: { flex: 1, gap: 2 },
  name: { color: Colors.dark.text, fontSize: Typography.sizes.md, fontWeight: Typography.weights.medium },
  lastMessage: { color: Colors.dark.icon, fontSize: Typography.sizes.sm },
  time: { color: Colors.dark.icon, fontSize: Typography.sizes.xs },
});