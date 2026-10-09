import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { getPublicStoreByOwner } from '@services/firebase/store';
import { useChat } from '@features/messaging/hooks/useChat';
import { useConversations } from '@features/messaging/hooks/useConversations';
import { useAuthStore } from '@stores/authStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Message } from '@/types/messaging';

type Props = {
  conversationId: string;
};

export const ChatPanel = ({ conversationId }: Props) => {
  const { colors } = useAppTheme();
  const { messages, send, currentUserId } = useChat(conversationId);
  const { conversations } = useConversations();
  const conversation = conversations.find(c => c.id === conversationId);
  const { user } = useAuthStore();
  const otherUserId = conversation?.participants.find(id => id !== currentUserId);
  const otherInfo = otherUserId ? conversation?.participantInfo[otherUserId] : null;
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const handleVisitStore = async () => {
    if (!otherUserId) return;
    const store = await getPublicStoreByOwner(otherUserId);
    if (store) {
      router.push(`/(app)/store-view/${store.id}`);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !otherUserId) return;
    const textToSend = input;
    setInput('');
    try {
      await send(textToSend, otherUserId);
    } catch (error) {
      setInput(textToSend);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === currentUserId;
    return (
      <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
        <View style={[styles.bubble, isMine ? { backgroundColor: colors.brand.primary } : { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
          <Text style={[styles.bubbleText, isMine && { color: '#fff' }]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleVisitStore} activeOpacity={0.7}>
        <Text style={styles.headerName}>{otherInfo?.name || 'Conversación'}</Text>
      </TouchableOpacity>
      
      <FlatList
        ref={listRef}
        data={[...messages].reverse()}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.list}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribí un mensaje..."
          placeholderTextColor={Colors.dark.icon}
          multiline
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.brand.primary }]} onPress={handleSend}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerName: { color: Colors.dark.text, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, marginBottom: Spacing.md },
  list: { flex: 1, marginBottom: Spacing.md },
  bubbleRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '75%', borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  bubbleText: { color: Colors.dark.text, fontSize: Typography.sizes.sm },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  input: { flex: 1, maxHeight: 100, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, color: Colors.dark.text, fontSize: Typography.sizes.sm },
  sendButton: { height: 40, justifyContent: 'center', paddingHorizontal: Spacing.lg, borderRadius: Radius.md },
  sendText: { color: '#fff', fontWeight: Typography.weights.semibold },
});