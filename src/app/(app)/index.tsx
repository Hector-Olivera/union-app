import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';
import { useStoreStore } from '@stores/storeStore';
import { useCommunity } from '@features/community/hooks/useCommunity';
import { useConversations } from '@features/messaging/hooks/useConversations';
import { useResponsiveLayout } from '@hooks/useResponsiveLayout';
import { AvatarPicker } from '@features/profile/components/AvatarPicker';
import { AvatarStack } from '@components/ui/AvatarStack';
import { SplitScreenLayout } from '@components/ui/SplitScreenLayout';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { activeTheme } = useThemeStore();
  const { store } = useStoreStore();
  const { storesWithNews } = useCommunity();
  const { conversations } = useConversations();
  const { useSplitLayout } = useResponsiveLayout();

  if (!user) return null;

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const firstName = user.displayName.split(' ')[0];

  const messageAvatars = conversations.map(c => {
    const otherId = c.participants.find(id => id !== user.id);
    const info = otherId ? c.participantInfo[otherId] : null;
    if (!info) return null;
    const isUnread = (c.unreadBy || []).includes(user.id);
    return { id: otherId!, name: info.name, imageUrl: info.avatarUrl, hasNew: isUnread };
  }).filter(Boolean) as any[];

  const newsAvatars = storesWithNews.map(s => ({
    id: s.id, name: s.name, imageUrl: s.logoUrl, hasNew: s.isAnnouncementUnseen,
  }));

  const pendingTodos = (store?.todos || []).filter(t => !t.done);

  const leftContent = (
    <>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={[styles.userName, { color: activeTheme.primary }]}>{firstName}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(app)/profile')}>
          <AvatarPicker displayName={user.displayName} avatarUrl={user.avatarUrl} size={56} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.card, { borderColor: `${activeTheme.primary}30` }]}
        onPress={() => router.push('/(app)/store')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>{store ? store.name : 'Activá tu tienda'}</Text>
        <Text style={styles.cardSubtitle}>
          {store ? 'Gestioná tu tienda, tu QR y tus productos.' : 'Vendé productos y servicios en Union App.'}
        </Text>
        <Text style={[styles.cardAction, { color: activeTheme.primary }]}>
          {store ? 'Ir a mi tienda →' : 'Activar →'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { borderColor: `${activeTheme.secondary}30` }]}
        onPress={() => router.push('/(app)/explore?tab=messages')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>Mensajes</Text>
        {messageAvatars.length > 0 ? (
          <>
            <AvatarStack items={messageAvatars} />
            {messageAvatars.some(a => a.hasNew) && (
              <Text style={[styles.newLabel, { color: activeTheme.secondary }]}>Mensaje nuevo</Text>
            )}
            <Text style={[styles.cardAction, { color: activeTheme.secondary }]}>Ver conversaciones →</Text>
          </>
        ) : (
          <Text style={styles.cardSubtitle}>No tenés mensajes nuevos.</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { borderColor: `${activeTheme.accent}30` }]}
        onPress={() => router.push('/(app)/explore?tab=notifications')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>Actividad reciente</Text>
        {newsAvatars.length > 0 ? (
          <>
            <AvatarStack items={newsAvatars} />
            {newsAvatars.some(a => a.hasNew) && (
              <Text style={[styles.newLabel, { color: activeTheme.accent }]}>Nueva novedad</Text>
            )}
            <Text style={[styles.cardAction, { color: activeTheme.accent }]}>Ver novedades →</Text>
          </>
        ) : (
          <Text style={styles.cardSubtitle}>Sin novedades de tus tiendas seguidas.</Text>
        )}
      </TouchableOpacity>

      {store && pendingTodos.length > 0 && (
        <TouchableOpacity
          style={[styles.card, { borderColor: `${activeTheme.primary}30` }]}
          onPress={() => router.push('/(app)/store')}
          activeOpacity={0.8}
        >
          <View style={styles.pendingHeader}>
            <Text style={styles.cardTitle}>Pendientes</Text>
            <View style={[styles.countBadge, { backgroundColor: `${activeTheme.primary}20` }]}>
              <Text style={[styles.countText, { color: activeTheme.primary }]}>{pendingTodos.length}</Text>
            </View>
          </View>
          {pendingTodos.slice(0, 3).map(todo => (
            <Text key={todo.id} style={styles.todoText} numberOfLines={1}>• {todo.text}</Text>
          ))}
        </TouchableOpacity>
      )}
    </>
  );

  const rightContent = (
    <View>
      <Text style={[styles.newsTitle, { color: activeTheme.primary }]}>Bienvenido a Union</Text>
      <Text style={styles.newsParagraph}>
        Gracias por formar parte de la comunidad de Union!
      </Text>
      <Text style={styles.newsParagraph}>
        Podés crear una tienda virtual 100% gratuita y personalizarla como más te guste.
      </Text>
      <Text style={styles.newsParagraph}>
        Publicitá tus productos ofreciendo regalos y descuentos.
      </Text>
      <Text style={styles.newsParagraph}>
        Siendo parte de Union es mucho más fácil comprar, vender e intercambiar servicios y productos con la comunidad.
      </Text>
    </View>
  );

  if (useSplitLayout) {
    return (
      <View style={styles.container}>
        <SplitScreenLayout left={leftContent} right={rightContent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {leftContent}
        <View style={styles.divider} />
        <Text style={styles.mobileSectionTitle}>Novedades de la app</Text>
      {rightContent}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  content: { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: Spacing.xl },
  headerText: { flex: 1, marginRight: Spacing.md },
  greeting: { color: Colors.dark.icon, fontSize: Typography.sizes.md },
  userName: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold },
  card: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.sm },
  cardTitle: { color: Colors.dark.text, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.semibold },
  cardSubtitle: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, lineHeight: 20 },
  cardAction: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  newLabel: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, letterSpacing: 0.5 },
  pendingHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  countBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full, minWidth: 22, alignItems: 'center' },
  countText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold },
  todoText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm },
  newsTitle: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold, marginBottom: Spacing.lg },
  newsParagraph: { color: Colors.dark.text, fontSize: Typography.sizes.lg, lineHeight: 24, marginBottom: Spacing.md },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: Spacing.lg,
  },
  mobileSectionTitle: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
  },
});