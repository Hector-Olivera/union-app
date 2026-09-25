import { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Dimensions,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useCommunity } from '@features/community/hooks/useCommunity';
import { useConversations } from '@features/messaging/hooks/useConversations';
import { useAuthStore } from '@stores/authStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { useResponsiveLayout } from '@hooks/useResponsiveLayout';
import { CommunityTabCarousel, TABS, type CommunityTab } from '@features/community/components/CommunityTabCarousel';
import { StoreSearch } from '@features/community/components/StoreSearch';
import { StoreListSection } from '@features/community/components/StoreListSection';
import { NotificationsSection } from '@features/community/components/NotificationsSection';
import { ConversationListItem } from '@features/messaging/components/ConversationListItem';
import { SplitScreenLayout } from '@components/ui/SplitScreenLayout';
import { StoreInfoCard } from '@components/ui/StoreInfoCard';
import { ChatPanel } from '@features/messaging/components/ChatPanel';
import { Colors, Typography, Spacing } from '@constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { useSplitLayout } = useResponsiveLayout();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<CommunityTab>('community');
  const scrollRef = useRef<ScrollView>(null);

  const {
    favoriteStores, recentStores, storesWithNews,
    search, visitStore, toggleFav, removeVisit,
    newStores, unvisitedNewsStores,
  } = useCommunity();
  const { conversations } = useConversations();
  const { user } = useAuthStore();

  // Conversación seleccionada en el panel de chat (solo relevante en split web)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (tab) {
      const index = TABS.findIndex(t => t.key === tab);
      if (index >= 0) {
        setActiveTab(tab as CommunityTab);
        scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: false });
      }
    }
  }, [tab]);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    const clamped = Math.max(0, Math.min(index, TABS.length - 1));
    setActiveTab(TABS[clamped].key);
  };

  const handleSelectTab = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setActiveTab(TABS[index].key);
  };

  // ── Contenido de cada pestaña, separado en left/right ──

  const communityLeft = (
    <>
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
    </>
  );

  const communityRight = (
    <View>
      <Text style={[styles.rightTitle, { color: colors.brand.primary }]}>Nuevas tiendas de la comunidad</Text>
      {newStores.length === 0 ? (
        <Text style={styles.emptyText}>No hay tiendas nuevas en los últimos 30 días.</Text>
      ) : (
        <View style={styles.cardsGrid}>
          {newStores.map(s => (
            <View key={s.id} style={styles.cardGridItem}>
              <StoreInfoCard
                storeId={s.id}
                storeName={s.name}
                logoUrl={s.logoUrl}
                bannerUrl={s.bannerUrl}
                contentLabel="ACERCA DE"
                contentText={s.description || 'Sin descripción todavía.'}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const notificationsLeft = <NotificationsSection storesWithNews={storesWithNews} onVisitStore={visitStore} />;

  const notificationsRight = (
    <View>
      <Text style={[styles.rightTitle, { color: colors.brand.accent }]}>¿Te enteraste?</Text>
      {unvisitedNewsStores.length === 0 ? (
        <Text style={styles.emptyText}>No hay novedades de tiendas que todavía no visitaste.</Text>
      ) : (
        <View style={styles.cardsGrid}>
          {unvisitedNewsStores.map(s => (
            <View key={s.id} style={styles.cardGridItem}>
              <StoreInfoCard
                key={s.id}
                storeId={s.id}
                storeName={s.name}
                logoUrl={s.logoUrl}
                bannerUrl={s.bannerUrl}
                contentLabel="NOVEDAD"
                contentText={s.announcements?.[0]?.text || ''}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const messagesLeft = (
    <View>
      {!user || conversations.length === 0 ? (
        <Text style={styles.emptyText}>
          Todavía no tenés conversaciones. Escribile a una tienda desde su perfil.
        </Text>
      ) : (
        conversations.map((c) => (
          <ConversationListItem
            key={c.id}
            conversation={c}
            currentUserId={user.id}
            onPress={useSplitLayout ? () => setSelectedConversationId(c.id) : undefined}
            isSelected={selectedConversationId === c.id}
          />
        ))
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={[styles.bgAccent, { backgroundColor: colors.brand.primary }]} pointerEvents="none" />
        <Text style={[styles.appTitle, { color: colors.brand.primary }]}>UNION APP</Text>
      </View>

      <CommunityTabCarousel activeTab={activeTab} onSelectTab={handleSelectTab} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        style={styles.pager}
      >
        {/* Página 1: Favoritos/Visitados */}
        <View style={{ width: SCREEN_WIDTH, flex: 1  }}>
          {useSplitLayout ? (
            <SplitScreenLayout left={communityLeft} right={communityRight} />
          ) : (
            <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
              {communityLeft}
              <View style={styles.divider} />
              {communityRight}
            </ScrollView>
          )}
        </View>

        {/* Página 2: Novedades */}
        <View style={{ width: SCREEN_WIDTH, flex: 1  }}>
          {useSplitLayout ? (
            <SplitScreenLayout left={notificationsLeft} right={notificationsRight} />
          ) : (
            <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
              {notificationsLeft}
              <View style={styles.divider} />              
              {notificationsRight}
            </ScrollView>
          )}
        </View>

        {/* Página 3: Mensajes */}
        <View style={{ width: SCREEN_WIDTH, flex: 1  }}>
          {useSplitLayout ? (
            <SplitScreenLayout
              left={messagesLeft}
              right={
                selectedConversationId
                  ? <ChatPanel conversationId={selectedConversationId} />
                  : <Text style={styles.emptyText}>Seleccioná una conversación para ver los mensajes.</Text>
              }
            />
          ) : (
            <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
              {messagesLeft}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.lg, overflow: 'hidden' },
  bgAccent: { position: 'absolute', top: -60, width: 180, height: 120, borderBottomLeftRadius: 90, borderBottomRightRadius: 90, opacity: 0.1 },
  appTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, letterSpacing: 3 },
  pager: { flex: 1 },
  pageContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  emptyText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm, fontStyle: 'italic', textAlign: 'center', marginTop: Spacing.xl },
  rightTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, marginBottom: Spacing.md },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: Spacing.lg },
  mobileSectionTitle: { color: Colors.dark.text, fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold, marginBottom: Spacing.md },
  cardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cardGridItem: {
    flexBasis: '31%', 
    minWidth: 290,     
  },
});