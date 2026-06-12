import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import type { QRScanResult } from '@/types/qr';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  result: QRScanResult;
  onDismiss: () => void;
};

// Mensajes y acciones según el tipo de QR detectado
const QR_CONFIG = {
  object_3d: {
    label: 'OBJETO 3D',
    color: Colors.brand.accent,
    description: (id: string) => `Objeto: ${id}`,
    actionLabel: 'Ver en AR',
  },
  location: {
    label: 'LUGAR VIRTUAL',
    color: Colors.brand.primary,
    description: (id: string) => `Lugar: ${id}`,
    actionLabel: 'Explorar lugar',
  },
  profile: {
    label: 'JUGADOR',
    color: Colors.brand.secondary,
    description: (id: string) => `Usuario: ${id}`,
    actionLabel: 'Ver perfil',
  },
  store_item: {
    label: 'ITEM DE TIENDA',
    color: Colors.status.success,
    description: (id: string) => `Item: ${id}`,
    actionLabel: 'Ver en tienda',
  },
  external_url: {
    label: 'ENLACE EXTERNO',
    color: Colors.status.warning,
    description: (id: string) => id.slice(0, 40) + (id.length > 40 ? '...' : ''),
    actionLabel: 'Abrir enlace',
  },
  unknown: {
    label: 'QR NO RECONOCIDO',
    color: Colors.dark.icon,
    description: (id: string) => 'Este QR no pertenece al ecosistema Union App',
    actionLabel: '',
  },
};

export const QRResultOverlay = ({ result, onDismiss }: Props) => {
  const config = QR_CONFIG[result.payload.type];

  const handleAction = async () => {
    const { type, id, data } = result.payload;

    switch (type) {
      case 'external_url':
        // Abrir URL externa en el navegador del sistema
        if (data?.url) await Linking.openURL(data.url);
        break;
      case 'object_3d':
        // En el futuro: navegar a la vista AR con el objeto cargado
        // router.push(`/(app)/ar-object?id=${id}`);
        console.log('[QR] object_3d:', id);
        break;
      case 'location':
        // En el futuro: navegar al lugar virtual
        console.log('[QR] location:', id);
        break;
      case 'profile':
        console.log('[QR] profile:', id);
        break;
      case 'store_item':
        console.log('[QR] store_item:', id);
        break;
    }
    onDismiss();
  };

  return (
    // Fondo semitransparente que cubre la parte inferior de la pantalla
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.card}>

        {/* Indicador de tipo */}
        <View style={[styles.typeBadge, { borderColor: config.color }]}>
          <Text style={[styles.typeLabel, { color: config.color }]}>
            {config.label}
          </Text>
        </View>

        {/* Descripción del contenido */}
        <Text style={styles.description}>
          {config.description(result.payload.id)}
        </Text>

        {/* Botones de acción */}
        <View style={styles.actions}>
          {config.actionLabel !== '' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: config.color }]}
              onPress={handleAction}
            >
              <Text style={styles.actionButtonText}>{config.actionLabel}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
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
    bottom: 350,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  card: {
    backgroundColor: 'rgba(10,10,26,0.95)',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.3)',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  typeLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 2,
  },
  description: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
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