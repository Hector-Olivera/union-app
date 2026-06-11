import { View, StyleSheet } from 'react-native';
import { Colors } from '@constants/theme';

// Mira central — indica el punto de enfoque de la cámara.
// Es el overlay más simple: cuatro esquinas que forman un marco.
// Estética HUD militar — coherente con el tema de la plataforma.
export const ARCrosshair = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* pointerEvents="none" en elementos decorativos puros —
          nunca deben interceptar toques del usuario */}

      {/* Las cuatro esquinas del marco */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />

      {/* Punto central */}
      <View style={styles.centerDot} />
    </View>
  );
};

const CORNER_SIZE = 20;
const CORNER_THICKNESS = 2;
const FRAME_SIZE = 200;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // Centrado exacto en pantalla
    top: '50%',
    left: '50%',
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    marginTop: -(FRAME_SIZE / 2),
    marginLeft: -(FRAME_SIZE / 2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.brand.primary,
    opacity: 0.9,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  centerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.brand.primary,
    opacity: 0.8,
  },
});