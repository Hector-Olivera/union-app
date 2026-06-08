import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '@constants/theme';
import { AuthButton } from '@features/auth/components/AuthButton';

// Modal genérico reutilizable de la plataforma.
// En el futuro recibirá contenido dinámico vía parámetros de ruta.
// Ejemplo de uso: router.push('/modal?type=inventory')
export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <Text style={styles.subtitle}>Contenido dinámico próximamente</Text>
      <AuthButton
        label="Cerrar"
        onPress={() => router.back()}
        variant="ghost"
      />
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
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.md,
    marginBottom: Spacing.xl,
  },
});