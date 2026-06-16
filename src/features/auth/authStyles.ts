import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

// Estilos compartidos entre login.tsx y register.tsx.
// Cuando ambas pantallas necesiten el mismo estilo, va acá.
// Estilos específicos de cada pantalla permanecen en sus propios archivos.
export const authStyles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scroll: {
    paddingBottom: Spacing.xl,
  },
  bgAccent: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.brand.primary,
    opacity: 0.08,
  },
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  tagline: {
    color: Colors.brand.primary,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 4,
    textTransform: 'uppercase' as const,
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
    marginBottom: Spacing.xl,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  firebaseError: {
    backgroundColor: 'rgba(255,82,82,0.1)',
    borderWidth: 1,
    borderColor: Colors.status.error,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  firebaseErrorText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.sm,
    textAlign: 'center' as const,
  },
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  footerText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
  footerLink: {
    color: Colors.brand.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});