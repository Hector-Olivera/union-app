import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@constants/theme';

// Módulo de exploración: mapa de lugares, jugadores cercanos, comunidad.
// Integrará expo-location + Google Maps API.
export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>MÓDULO</Text>
      <Text style={styles.title}>Explorar</Text>
      <Text style={styles.subtitle}>Mapa + comunidad — próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  label: {
    color: Colors.brand.secondary,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.display,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.md,
  },
});