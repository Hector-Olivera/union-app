import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '@constants/theme';

type Props = {
  onFlip: () => void;
  onCapture?: () => void;
  // onCapture es opcional — en modo QR no se necesita
  mode: 'ar' | 'qr' | 'photo';
  // mode define qué controles se muestran
  // ar: flip + overlay controls
  // qr: solo scanning (sin botón de captura)
  // photo: flip + captura
  hidden?: boolean;
};

export const CameraControls = ({ onFlip, onCapture, mode, hidden = false }: Props) => {
   if (hidden) return null;
  return (
    <View style={styles.container}>

      {/* Botón flip — siempre visible */}
      <TouchableOpacity
        style={styles.controlButton}
        onPress={onFlip}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.controlIcon}>⇄</Text>
      </TouchableOpacity>

      {/* Botón de captura — solo en modos ar y photo */}
      {mode !== 'qr' && onCapture && (
        <TouchableOpacity
          style={styles.captureButton}
          onPress={onCapture}
          activeOpacity={0.8}
        >
          {/* Diseño HUD: círculo exterior + punto interior */}
          <View style={styles.captureInner} />
        </TouchableOpacity>
      )}

      {/* Indicador de modo QR */}
      {mode === 'qr' && (
        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>MODO QR</Text>
        </View>
      )}

      {/* Espacio reservado para mantener el flex simétrico */}
      <View style={styles.controlButton} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    // Degradado oscuro desde abajo — da profundidad sin tapar la cámara
    backgroundColor: 'rgba(10,10,10,0.6)',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    color: Colors.dark.text,
    fontSize: 20,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // El anillo exterior blanco es el patrón estándar de botón de captura
    // que los usuarios ya reconocen de la cámara nativa
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  modeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.brand.accent,
    backgroundColor: 'rgba(67,232,216,0.1)',
  },
  modeBadgeText: {
    color: Colors.brand.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
});