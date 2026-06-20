import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ARLogoSpinner } from './ARLogoSpinner';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { useStorePreview } from '@features/qr/hooks/useStorePreview';

type Props = {
  storeId: string;
  onDismiss: () => void;
};

// Vista AR especializada para QRs de tipo "store".
// Reemplaza el QRResultOverlay genérico con una experiencia más rica:
// logo girando con efecto 3D simulado + acción directa a la tienda.
export const StoreARPreview = ({ storeId, onDismiss }: Props) => {
  const { colors } = useAppTheme();
  const { store, loading } = useStorePreview(storeId);


  const handleGoToStore = () => {
    onDismiss();
    // TODO: navegar a la vista pública de la tienda cuando exista
    // Por ahora navega al dashboard si es la propia tienda del usuario
    router.push('/(app)/store');
  };

  const displayName = loading ? 'Cargando...' : (store?.name || 'Tienda no encontrada');
  const initial = store?.name ? store.name.charAt(0).toUpperCase() : 'U';

  return (
    <View style={styles.container} pointerEvents="box-none">

      {/* Logo girando — el efecto AR principal */}
      <View style={styles.spinnerArea}>
        <ARLogoSpinner
          color={colors.brand.primary}
          secondaryColor={colors.brand.secondary}
          size={130}
          label={initial}
        />
      </View>

      {/* Card inferior con info y acción */}
      <View style={styles.card}>
        <Text style={styles.badge}>TIENDA DETECTADA</Text>
        <Text style={styles.storeName}>
          {displayName}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.goButton, { backgroundColor: colors.brand.primary }]}
            onPress={handleGoToStore}
            activeOpacity={0.85}
            disabled={!store}
          >
            <Text style={styles.goButtonText}>Ir a la tienda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
            activeOpacity={0.7}
          >
            <Text style={styles.dismissText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
  },
  spinnerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
    // El logo flota en el área central de la cámara, como AR real
  },
  card: {
    position: 'absolute',
    bottom: 110,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: 'rgba(10,10,26,0.95)',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.3)',
    gap: Spacing.sm,
  },
  badge: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 2,
  },
  storeName: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  goButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  dismissButton: {
    height: 44,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  dismissText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
});