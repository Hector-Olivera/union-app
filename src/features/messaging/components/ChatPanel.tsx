import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { markConversationAsRead } from '@services/firebase/messaging';
import { getPublicStoreByOwner } from '@services/firebase/store';
import { useChat } from '@features/messaging/hooks/useChat';
import { useConversations } from '@features/messaging/hooks/useConversations';
import { useAuthStore } from '@stores/authStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Message } from '@/types/messaging';
import { SafetyMenu } from '@/features/safety/components/SafetyMenu';
import { useBlockStore } from '@/stores/blockStore';

type Props = {
  conversationId: string;
  active?: boolean;
  onBlocked?: () => void;
};

export const ChatPanel = ({ conversationId, active = true, onBlocked }: Props) => {
  const { colors } = useAppTheme();
  const { messages, send, currentUserId } = useChat(conversationId);
  const { conversations } = useConversations();
  const conversation = conversations.find(c => c.id === conversationId);
  const { user } = useAuthStore();
  const otherUserId = conversation?.participants.find(id => id !== currentUserId);
  const otherInfo = otherUserId ? conversation?.participantInfo[otherUserId] : null;
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  const blockedByMe = useBlockStore(s => !!otherUserId && s.blockedIds.includes(otherUserId));
  const [sendError, setSendError] = useState<string | null>(null);

  const isFocused = useIsFocused();
  const isUnread = !!currentUserId && (conversation?.unreadBy || []).includes(currentUserId);

  useEffect(() => {
    setSendError(null);
  }, [conversationId, blockedByMe]);

  useEffect(() => {
    setInput('');
  }, [conversationId]);


  useEffect(() => {
    // Solo marcamos como leído si el panel está realmente a la vista y la
    // conversación tiene algo sin leer. El chequeo de isUnread evita escrituras
    // innecesarias a Firestore y cualquier posible ciclo de escritura.
    if (active && isFocused && isUnread && currentUserId) {
      markConversationAsRead(conversationId, currentUserId);
    }
  }, [conversationId, currentUserId, active, isFocused, isUnread]);

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
    setSendError(null);
    setInput('');
    try {
      await send(textToSend, otherUserId);
    } catch (error: any) {
      setSendError('No puedes enviar mensajes a este usuario.');
      if (error?.code !== 'permission-denied') {
        console.error('[Chat] send error:', error);
      }
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleVisitStore} activeOpacity={0.7}>
          <Text style={styles.headerName}>{otherInfo?.name || 'Conversación'}</Text>
        </TouchableOpacity>
        {otherUserId && (
          <SafetyMenu
            target={{ userId: otherUserId, name: otherInfo?.name || 'Usuario', avatarUrl: otherInfo?.avatarUrl, conversationId }}
            onBlocked={onBlocked}
          />
        )}
      </View>
      
      <FlatList
        ref={listRef}
        data={[...messages].reverse()}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.list}
      />

      {blockedByMe ? (
        <View style={styles.blockedNotice}>
          <Text style={styles.blockedText}>
            Bloqueaste a este usuario. Desbloquealo desde el menú (⋯) para volver a escribirle.
          </Text>
        </View>
      ) : (
        <>
          {!!sendError && <Text style={styles.sendError}>{sendError}</Text>}
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
        </>
      )}
      
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  blockedNotice: { padding: Spacing.lg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  blockedText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, textAlign: 'center' },
  sendError: { color: Colors.status.error, fontSize: Typography.sizes.xs, paddingHorizontal: Spacing.md },
});