import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@stores/themeStore';
import { Colors, Typography, Spacing } from '@constants/theme';

type Props = {
  module: string;        // Nombre del módulo — ej: "MÓDULO"
  title: string;         // Título grande — ej: "Inicio"
  subtitle: string;      // Descripción — ej: "Hub central — próximamente"
  accentColor?: string;  // Color del label superior, default: primary del tema
};

// Pantalla placeholder reutilizable para módulos en construcción.
// Reemplaza las 4 pantallas con código duplicado.
// Cuando el módulo esté listo, simplemente se reemplaza este componente
// por el contenido real sin tocar la estructura de rutas.
export const PlaceholderScreen = ({ module, title, subtitle, accentColor }: Props) => {
  const insets = useSafeAreaInsets();
  const { activeTheme } = useThemeStore();
  const labelColor = accentColor || activeTheme.primary;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={[styles.module, { color: labelColor }]}>{module}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  module: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 4,
    textTransform: 'uppercase',
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
    textAlign: 'center',
  },
});