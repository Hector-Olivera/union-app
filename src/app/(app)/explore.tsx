import { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Dimensions,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCommunity } from '@features/community/hooks/useCommunity';
import { useConversations } from '@features/messaging/hooks/useConversations';
import { useAuthStore } from '@stores/authStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { CommunityTabCarousel, TABS, type CommunityTab } from '@features/community/components/CommunityTabCarousel';
import { StoreSearch } from '@features/community/components/StoreSearch';
import { StoreListSection } from '@features/community/components/StoreListSection';
import { NotificationsSection } from '@features/community/components/NotificationsSection';
import { ConversationListItem } from '@features/messaging/components/ConversationListItem';
import { Colors, Typography, Spacing } from '@constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const initialTab = (tab as CommunityTab) || 'community';
  const [activeTab, setActiveTab] = useState<CommunityTab>('community');
  const scrollRef = useRef<ScrollView>(null);

  const {
    favoriteStores, recentStores, storesWithNews,
    search, visitStore, toggleFav, removeVisit,
  } = useCommunity();
  const { conversations } = useConversations();
  const { user } = useAuthStore();

  // Cuando el swipe termina de asentarse, calculamos qué página
  // quedó en pantalla y actualizamos la pestaña activa
  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    const clamped = Math.max(0, Math.min(index, TABS.length - 1));
    setActiveTab(TABS[clamped].key);
  };

  // Cuando se toca una etiqueta directamente, scrolleamos con animación
  const handleSelectTab = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setActiveTab(TABS[index].key);
  };

  useEffect(() => {
    if (tab) {
      const index = TABS.findIndex(t => t.key === tab);
      if (index >= 0) {
        setActiveTab(tab as CommunityTab);
        scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: false });
      }
    }
  }, [tab]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header con título y semicírculo decorativo */}
      <View style={styles.header}>
        <View style={[styles.bgAccent, { backgroundColor: colors.brand.primary }]} pointerEvents="none" />
        <Text style={[styles.appTitle, { color: colors.brand.primary }]}>UNION APP</Text>
      </View>

      <CommunityTabCarousel activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* El swipe real ocurre acá — cada página es ancho completo
          de pantalla, con su propio scroll vertical interno */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        style={styles.pager}
      >

        {/* Página 1: Favoritos / Recientes */}
        <ScrollView style={{ width: SCREEN_WIDTH }} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
          <StoreSearch onSearch={search} onVisitStore={visitStore} />
          <StoreListSection
            title="Favoritos"
            stores={favoriteStores}
            emptyMessage="Todavía no marcaste ninguna tienda como favorita."
            onVisitStore={visitStore}
            onRemoveStore={toggleFav}
          />
          <StoreListSection
            title="Visitadas recientemente"
            stores={recentStores}
            emptyMessage="Las tiendas que visites van a aparecer acá."
            onVisitStore={visitStore}
            onRemoveStore={removeVisit}
          />
        </ScrollView>

        {/* Página 2: Notificaciones */}
        <ScrollView style={{ width: SCREEN_WIDTH }} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
          <NotificationsSection storesWithNews={storesWithNews} onVisitStore={visitStore} />
        </ScrollView>

        {/* Página 3: Mensajes */}
        <ScrollView style={{ width: SCREEN_WIDTH }} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
          {!user ? null : conversations.length === 0 ? (
            <Text style={styles.emptyText}>
              Todavía no tenés conversaciones. Escribile a una tienda desde su perfil.
            </Text>
          ) : (
            conversations.map((c) => (
              <ConversationListItem key={c.id} conversation={c} currentUserId={user.id} />
            ))
          )}
        </ScrollView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    overflow: 'hidden',
  },
  bgAccent: {
    position: 'absolute',
    top: -50,
    width: 190,
    height: 140,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
    opacity: 0.1,
  },
  appTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    letterSpacing: 3,
  },
  pager: { flex: 1 },
  pageContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  emptyText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});