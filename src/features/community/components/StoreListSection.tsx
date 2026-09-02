import { View, Text, StyleSheet } from 'react-native';
import { StoreListItem } from './StoreListItem';
import { Colors, Typography, Spacing } from '@constants/theme';
import type { StoreSummary } from '@/types/community';

type Props = {
  title: string;
  stores: StoreSummary[];
  emptyMessage: string;
  onVisitStore: (storeId: string) => void;
  onRemoveStore?: (storeId: string) => void;
};

export const StoreListSection = ({ title, stores, emptyMessage, onVisitStore, onRemoveStore }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {stores.length === 0 ? (
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    ) : (
      stores.map((store) => (
        <StoreListItem
          key={store.id}
          store={store}
          onPress={() => onVisitStore(store.id)}
          onRemove={onRemoveStore ? () => onRemoveStore(store.id) : undefined}
        />
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
  },
});