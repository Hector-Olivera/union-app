import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { createShadow } from '@utils/shadowStyle';

type Props = {
  color: string;
  secondaryColor?: string;
  size?: number;
  label?: string; // Iniciales o letra del logo — placeholder hasta tener logos reales
};

// Simula un objeto 3D rotando usando transforms 2D con perspectiva.
// No es WebGL real, pero el efecto visual de "objeto girando en el espacio"
// es convincente porque usamos perspective + rotateY + escala dinámica.
export const ARLogoSpinner = ({
  color, secondaryColor, size = 120, label = 'U'
}: Props) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        // 4 segundos por vuelta completa — lento y elegante,
        // no agresivo como un loading spinner
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Interpolamos el valor 0-1 a grados 0-360 para la rotación Y
  const rotateY = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // La escala simula que el objeto se "achica" cuando está de perfil (90°/270°)
  // y vuelve a tamaño normal de frente (0°/180°)
  // Esto refuerza la ilusión de profundidad
  const scaleX = rotation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.3, 1, 0.3, 1],
  });

  // Sombra que se mueve — refuerza la sensación de objeto flotando
  const shadowOpacity = rotation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0.4, 0.15, 0.4, 0.15, 0.4],
  });

  const spinnerShadow = createShadow({ color, offsetY: 8, opacity: 0.5, radius: 16, elevation: 10 });

  return (
    <View style={styles.container}>

      {/* Sombra proyectada debajo del objeto */}
      <Animated.View style={[
        styles.shadow,
        {
          width: size * 0.8,
          opacity: shadowOpacity,
        }
      ]} />

      {/* El "objeto 3D" simulado */}
      <Animated.View
        style={[
          styles.spinner,
          spinnerShadow,
          {
            width: size,
            height: size,
            borderRadius: size / 5,
            backgroundColor: color,
            transform: [
              { perspective: 800 },
              // perspective define qué tan pronunciado es el efecto 3D
              // valores más bajos = más distorsión, más altos = más sutil
              { rotateY },
              { scaleX },
            ],
          }
        ]}
      >
        <Text style={[styles.label, { fontSize: size * 0.4 }]}>
          {label}
        </Text>
      </Animated.View>

      {/* Halo de luz ambiental detrás — da sensación de "flotando en AR" */}
      <View style={[
        styles.glow,
        {
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: size * 0.9,
          backgroundColor: secondaryColor || color,
        }
      ]} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    opacity: 0.12,
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontWeight: '900',
  },
  shadow: {
    position: 'absolute',
    bottom: -20,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
});