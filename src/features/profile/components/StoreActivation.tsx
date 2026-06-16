import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '@hooks/useAppTheme';
import { Typography, Spacing, Radius, Colors } from '@constants/theme';

type Props = {
  hasStore: boolean;
  onActivate: () => void;
  saving: boolean;
};

export const StoreActivation = ({ hasStore, onActivate, saving }: Props) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Tienda</Text>
        {hasStore && (
          <View style={[styles.activeBadge, { backgroundColor: `${colors.brand.accent}20`, borderColor: colors.brand.accent }]}>
            <Text style={[styles.activeBadgeText, { color: colors.brand.accent }]}>ACTIVA</Text>
          </View>
        )}
      </View>

      {!hasStore ? (
        // Estado: sin tienda
        <View style={styles.inactiveContainer}>
          <Text style={styles.description}>
            Creá tu tienda dentro del ecosistema Union App. Vendé productos, ofrecé servicios y generá tu QR personalizado.
          </Text>
          <TouchableOpacity
            style={[styles.activateButton, { backgroundColor: colors.brand.secondary }]}
            onPress={onActivate}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Text style={styles.activateButtonText}>
              {saving ? 'Activando...' : 'Activar mi tienda'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Estado: tienda activa
        <View style={styles.activeContainer}>
          <TouchableOpacity
            style={[styles.storeButton, { borderColor: colors.brand.primary }]}
            onPress={() => router.push('/(app)/store')}
            activeOpacity={0.8}
          >
            <Text style={[styles.storeButtonText, { color: colors.brand.primary }]}>
              Ver mi tienda
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.storeButton, { borderColor: colors.brand.accent }]}
            onPress={() => console.log('TODO: QR generator')}
            activeOpacity={0.8}
          >
            <Text style={[styles.storeButtonText, { color: colors.brand.accent }]}>
              Generar QR
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  activeBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  activeBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  inactiveContainer: { gap: Spacing.md },
  description: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
  activateButton: {
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activateButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  activeContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  storeButton: {
    flex: 1,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});