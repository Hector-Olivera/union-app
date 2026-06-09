import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@constants/theme';

// Hub central de la plataforma.
// Acá irán accesos rápidos a los módulos y actividad de la comunidad.
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>UNION APP</Text>
      <Text style={styles.title}>Inicio</Text>
      <Text style={styles.subtitle}>Hub central — próximamente</Text>
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
    color: Colors.brand.primary,
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