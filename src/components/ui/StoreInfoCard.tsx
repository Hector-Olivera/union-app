import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  storeId: string;
  storeName: string;
  logoUrl?: string;
  bannerUrl?: string;
  contentLabel: string; // "Acerca de" o "Novedad"
  contentText: string;
};

export const StoreInfoCard = ({ storeId, storeName, logoUrl, bannerUrl, contentLabel, contentText }: Props) => {
  const initial = storeName.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(app)/store-view/${storeId}`)}
      activeOpacity={0.8}
    >
      {bannerUrl ? (
        <Image source={{ uri: bannerUrl }} style={styles.banner} />
      ) : (
        <View style={[styles.banner, styles.bannerPlaceholder]} />
      )}

      <View style={styles.header}>
        {logoUrl ? (
          <Image source={{ uri: logoUrl }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoInitial}>{initial}</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>{storeName}</Text>
      </View>

      <Text style={styles.contentLabel}>{contentLabel}</Text>
      <Text style={styles.contentText} numberOfLines={3}>{contentText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  banner: { width: '100%', height: 100 },
  bannerPlaceholder: { backgroundColor: 'rgba(255,255,255,0.05)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  logo: { width: 32, height: 32, borderRadius: Radius.sm },
  logoPlaceholder: {
    width: 32, height: 32, borderRadius: Radius.sm,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  logoInitial: { color: '#fff', fontSize: 14, fontWeight: '900' },
  name: { color: Colors.dark.text, fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold, flex: 1 },
  contentLabel: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
    paddingHorizontal: Spacing.md,
  },
  contentText: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
    padding: Spacing.md,
    paddingTop: 4,
  },
});