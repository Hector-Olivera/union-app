import { View, Text, StyleSheet } from 'react-native';
import { StoreListItem } from './StoreListItem';
import { Colors, Typography, Spacing } from '@constants/theme';
import type { StoreSummary } from '@/types/community';
import { AnnouncementListItem } from './AnnouncementListItem';

type Props = {
  storesWithNews: StoreSummary[];
  onVisitStore: (storeId: string) => void;
};

export const NotificationsSection = ({ storesWithNews, onVisitStore }: Props) => (
  <View style={styles.container}>
    {storesWithNews.length === 0 ? (
      <Text style={styles.emptyText}>
        No hay novedades de las tiendas que seguís o visitaste.
      </Text>
    ) : (
      storesWithNews.map((store) => (
        <AnnouncementListItem key={store.id} store={store} onVisit={() => onVisitStore(store.id)} />
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  emptyText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});