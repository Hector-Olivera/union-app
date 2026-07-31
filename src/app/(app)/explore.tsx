import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCommunity } from '@features/community/hooks/useCommunity';
import { StoreSearch } from '@features/community/components/StoreSearch';
import { StoreListSection } from '@features/community/components/StoreListSection';
import { Colors, Spacing } from '@constants/theme';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { favoriteStores, recentStores, search, visitStore, toggleFav, removeVisit } = useCommunity();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.dark.background
  },
  content: { 
    paddingHorizontal: Spacing.xl, 
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.sm
  },
});