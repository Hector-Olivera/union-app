import { View, Text, TouchableOpacity, Image, Share, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { StoreSummary } from '@/types/community';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  store: StoreSummary;
  onPress?: () => void;
  onRemove?: () => void;
};

export const StoreListItem = ({ store, onPress, onRemove }: Props) => {
  const { colors } = useAppTheme();

  const handlePress = () => {
    onPress?.();
    router.push(`/(app)/store-view/${store.id}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mirá la tienda "${store.name}" en Union App: unionapp://store/${store.id}`,
        title: store.name,
      });
    } catch (error) {
      console.error('[StoreListItem] share error:', error);
    }
  };

  const initial = store.name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.75}>

      {/* Logo o inicial */}
      {store.logoUrl ? (
        <Image source={{ uri: store.logoUrl }} style={styles.logo} />
      ) : (
        <View style={[styles.logoPlaceholder, { backgroundColor: colors.brand.primary }]}>
          <Text style={styles.logoInitial}>{initial}</Text>
        </View>
      )}

      {/* Nombre + indicador de novedad */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{store.name}</Text>
        {store.isAnnouncementUnseen && (
          <View style={styles.newBadge}>
            <View style={[styles.newDot, { backgroundColor: colors.brand.secondary }]} />
            <Text style={[styles.newText, { color: colors.brand.secondary }]}>Novedad</Text>
          </View>
        )}
      </View>

      {/* Botón compartir — no navega, solo comparte */}
      <TouchableOpacity
        onPress={(e) => { e.stopPropagation?.(); handleShare(); }}
        style={styles.shareButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-redo-outline" size={20} color={Colors.dark.icon} />
      </TouchableOpacity>

      {onRemove && (
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation?.(); onRemove(); }}
          style={styles.removeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color={Colors.dark.icon} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
  },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  info: { flex: 1, gap: 2 },
  name: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
  },
  newBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newDot: { width: 5, height: 5, borderRadius: 2.5 },
  newText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold },
  shareButton: {
    padding: Spacing.xs,
  },
  removeButton: {
    padding: Spacing.xs,
  },
});