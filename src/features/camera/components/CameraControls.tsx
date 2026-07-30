import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '@constants/theme';

type Props = {  
  mode: 'ar' | 'qr' | 'photo';
  hidden?: boolean;
};

export const CameraControls = ({ mode, hidden = false }: Props) => {
  if (hidden) return null;
  
  return (
    <View style={styles.container}>
      {mode === 'qr' && (
        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>MODO QR</Text>
        </View>
      )}
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
    justifyContent: 'center',
    // Degradado oscuro desde abajo — da profundidad sin tapar la cámara
    backgroundColor: 'rgba(10,10,10,0.6)',
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