import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@stores/authStore';
import { AuthInput } from '@features/auth/components/AuthInput';
import { AuthButton } from '@features/auth/components/AuthButton';
import { useAuthForm } from '@features/auth/hooks/useAuthForm';
import { Colors, Typography, Spacing } from '@constants/theme';

export default function LoginScreen() {
  const { login, loading, error, clearError } = useAuthStore();
  const { fields, errors, touchField, updateField, validateAll } = useAuthForm('login');

  const handleLogin = async () => {
    // 1. Validar localmente antes de hacer cualquier llamada
    if (!validateAll()) return;
    clearError(); // Limpia errores previos de Firebase
    await login(fields.email, fields.password);
    // El redirect lo maneja index.tsx via el observer de Firebase
    // No navegamos manualmente acá — separación de responsabilidades
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // iOS y Android manejan el teclado diferente
      // 'padding' en iOS sube el contenido, 'height' en Android reduce el viewport
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        // "handled" permite que los taps en botones funcionen
        // incluso cuando el teclado está abierto
      >
        {/* Fondo decorativo */}
        <View style={styles.bgAccent} pointerEvents="none" />

        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.tagline}>UNION APP</Text>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>
              Ingresa al universo aumentado
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <AuthInput
              label="Email"
              value={fields.email}
              onChangeText={(v) => updateField('email', v)}
              onBlur={() => touchField('email')}
              error={errors.email}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoComplete="email"
            />
            <AuthInput
              label="Contraseña"
              value={fields.password}
              onChangeText={(v) => updateField('password', v)}
              onBlur={() => touchField('password')}
              error={errors.password}
              placeholder="••••••••"
              secureTextEntry
            />

            {/* Error de Firebase (distinto a errores de validación local) */}
            {!!error && (
              <View style={styles.firebaseError}>
                <Text style={styles.firebaseErrorText}>{error}</Text>
              </View>
            )}

            <AuthButton
              label="Ingresar"
              onPress={handleLogin}
              loading={loading}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                ¿Has Olvidado tu contraseña?        -.-
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer — navegación a Register */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tenés cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Registrate</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.dark.background },
  scroll: { flexGrow: 1 },
  bgAccent: {
    // Círculo decorativo — da profundidad sin necesitar librerías externas
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
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  tagline: {
    color: Colors.brand.primary,
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
  },
  form: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  firebaseError: {
    backgroundColor: 'rgba(255,82,82,0.1)',
    borderWidth: 1,
    borderColor: Colors.status.error,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  firebaseErrorText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
  forgotPassword: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  forgotPasswordText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.lg,
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