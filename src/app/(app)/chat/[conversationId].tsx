import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '@features/messaging/hooks/useChat';
import { useConversations } from '@features/messaging/hooks/useConversations';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { markConversationAsRead } from '@services/firebase/messaging';
import type { Message } from '@/types/messaging';
import { getPublicStoreByOwner } from '@/services/firebase/store';


export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { messages, send, currentUserId } = useChat(conversationId);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  const { conversations } = useConversations();
  const conversation = conversations.find(c => c.id === conversationId);
  const otherUserId = conversation?.participants.find(id => id !== currentUserId);
  const otherInfo = otherUserId ? conversation?.participantInfo[otherUserId] : null;
  const otherInitial = otherInfo?.name.charAt(0).toUpperCase() || '?';

  const isFocused = useIsFocused();

  useEffect(() => {
    // Solo marcamos como leído si la pantalla está realmente en foco  
    if (conversationId && currentUserId && isFocused) {
      markConversationAsRead(conversationId, currentUserId);
    }
  }, [conversationId, currentUserId, messages.length, isFocused]);

  const handleSend = async () => {
    if (!input.trim() || !otherUserId) return;
    const textToSend = input;
    setInput(''); // Limpiamos inmediatamente — no esperamos la red para dar feedback visual
    try {
      await send(textToSend, otherUserId);
    } catch (error) {
      // Si falla el envío, restauramos el texto para que el usuario no lo pierda
      setInput(textToSend);
      console.error('[Chat] send error:', error);
    }
    setTimeout(() => listRef.current?.scrollToIndex({ index: 0 }), 100);
  };

  const handleVisitStore = async () => {
    if (!otherUserId) return;
    const store = await getPublicStoreByOwner(otherUserId);
    if (store) {
      router.push(`/(app)/store-view/${store.id}`);
    }
    // Si no tiene tienda pública, no pasa nada — silenciosamente
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === currentUserId;
    return (
      <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
        <View style={[
          styles.bubble,
          isMine
            ? { backgroundColor: colors.brand.primary }
            : { backgroundColor: 'rgba(255,255,255,0.08)' }
        ]}>
          <Text style={[styles.bubbleText, isMine && { color: '#fff' }]}> {item.text}  </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(app)/explore?tab=messages')} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.brand.primary }]}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleVisitStore} style={styles.headerUserInfo} activeOpacity={0.7}>
          {otherInfo?.avatarUrl ? (
            <Image source={{ uri: otherInfo.avatarUrl }} style={styles.headerAvatar} />
          ) : (
            <View style={[styles.headerAvatarPlaceholder, { backgroundColor: colors.brand.primary }]}>
              <Text style={styles.headerAvatarInitial}>{otherInitial}</Text>
            </View>
          )}
          <Text style={styles.headerName} numberOfLines={1}>
            {otherInfo?.name || 'Conversación'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={[...messages].reverse()}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
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
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.brand.primary }]}
          onPress={handleSend}
        >
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  backText: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold },
  messagesList: { padding: Spacing.lg, gap: Spacing.xs },
  bubbleRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '75%',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  bubbleText: { color: Colors.dark.text, fontSize: Typography.sizes.md },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
  },
  sendButton: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  sendText: { color: '#fff', fontWeight: Typography.weights.semibold },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: Spacing.sm,
  paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    paddingRight: Spacing.xs,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarInitial: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  headerName: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    flex: 1,
  },
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
});