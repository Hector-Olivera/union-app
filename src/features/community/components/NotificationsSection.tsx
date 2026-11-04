import { View, Text, StyleSheet } from 'react-native';
import { StoreInfoCard } from '@components/ui/StoreInfoCard';
import { Colors, Typography, Spacing } from '@constants/theme';
import type { StoreSummary } from '@/types/community';

type Props = {
  storesWithNews: StoreSummary[];
};

// Novedades de las tiendas que seguís o visitaste. Usa la misma tarjeta que
// "¿Te enteraste?" para que las dos listas se vean igual. Al entrar a la
// tienda, la pantalla de tienda registra la visita sola.
export const NotificationsSection = ({ storesWithNews }: Props) => (
  <View style={styles.container}>
    {storesWithNews.length === 0 ? (
      <Text style={styles.emptyText}>
        No hay novedades de las tiendas que seguís o visitaste.
      </Text>
    ) : (
      storesWithNews.map((store) => (
        <View key={store.id} style={styles.item}>
          <StoreInfoCard
            storeId={store.id}
            storeName={store.name}
            logoUrl={store.logoUrl}
            bannerUrl={store.bannerUrl}
            contentLabel="NOVEDAD"
            contentText={store.latestAnnouncementText || ''}
          />
        </View>
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  item: { marginBottom: Spacing.md },
  emptyText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});