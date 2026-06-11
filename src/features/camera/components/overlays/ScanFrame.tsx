import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { Colors, Typography, Spacing } from '@constants/theme';

// Marco de escaneo animado para modo QR.
// La línea que se mueve de arriba a abajo simula el escaneo activo
// — patrón visual reconocido universalmente en apps de escaneo.
export const ScanFrame = () => {
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  // useRef para el valor animado evita que se recree en cada render.
  // Animated.Value(0) = posición inicial arriba del frame.

  useEffect(() => {
    // Animación en loop infinito: la línea baja y sube continuamente
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          // useNativeDriver: true mueve la animación al hilo nativo de UI
          // — más fluido, no bloquea el hilo de JavaScript
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    // Cleanup: detener la animación cuando el componente se desmonta
    return () => animation.stop();
  }, []);

  const FRAME_SIZE = 240;

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 2],
    // Mueve la línea desde el top hasta el bottom del frame
  });

  return (
    <View style={styles.container} pointerEvents="none">

      {/* Overlay oscuro con hueco central — enfoca la atención en el QR */}
      <View style={[styles.mask, styles.maskTop]} />
      <View style={styles.maskMiddle}>
        <View style={[styles.mask, styles.maskSide]} />

        {/* Frame de escaneo */}
        <View style={[styles.frame, { width: FRAME_SIZE, height: FRAME_SIZE }]}>
          {/* Esquinas del frame */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {/* Línea de escaneo animada */}
          <Animated.View
            style={[styles.scanLine, { transform: [{ translateY }] }]}
          />
        </View>

        <View style={[styles.mask, styles.maskSide]} />
      </View>
      <View style={[styles.mask, styles.maskBottom]} />

      {/* Instrucción */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Apuntá al código QR
        </Text>
      </View>

    </View>
  );
};

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mask: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  maskTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '30%',
  },
  maskMiddle: {
    position: 'absolute',
    top: '30%',
    left: 0, right: 0,
    height: 240,
    flexDirection: 'row',
  },
  maskSide: {
    flex: 1,
  },
  maskBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    top: 'auto',
    height: '35%',
  },
  frame: {
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.brand.accent,
  },
  topLeft: {
    top: 0, left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  topRight: {
    top: 0, right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  bottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  bottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  scanLine: {
    position: 'absolute',
    left: 0, right: 0,
    height: 2,
    backgroundColor: Colors.brand.accent,
    opacity: 0.8,
    shadowColor: Colors.brand.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    // El shadow crea un efecto glow alrededor de la línea de escaneo
  },
  instructionContainer: {
    position: 'absolute',
    bottom: '33%',
    alignSelf: 'center',
  },
  instruction: {
    color: '#fff',
    fontSize: Typography.sizes.sm,
    letterSpacing: 1,
    opacity: 0.8,
  },
});