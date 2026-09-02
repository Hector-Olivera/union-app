import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { StoreSummary } from '@/types/community';

type Props = {
  store: StoreSummary;
  onVisit: () => void;
};

export const AnnouncementListItem = ({ store, onVisit }: Props) => {
  const { colors } = useAppTheme();
  const initial = store.name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onVisit(); // marca la visita (actualiza recentVisits)
        router.push(`/(app)/store-view/${store.id}`);
      }}
      activeOpacity={0.75}>
      <View style={styles.header}>
        {store.logoUrl ? (
          <Image source={{ uri: store.logoUrl }} style={styles.logo} />
        ) : (
          <View style={[styles.logoPlaceholder, { backgroundColor: colors.brand.primary }]}>
            <Text style={styles.logoInitial}>{initial}</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>{store.name}</Text>
      </View>

      <Text style={styles.announcementText} numberOfLines={3}>
        {store.latestAnnouncementText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logo: { width: 32, height: 32, borderRadius: Radius.sm },
  logoPlaceholder: {
    width: 32, height: 32, borderRadius: Radius.sm,
    justifyContent: 'center', alignItems: 'center',
  },
  logoInitial: { color: '#fff', fontSize: 14, fontWeight: '900' },
  name: { color: Colors.dark.text, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  announcementText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
});