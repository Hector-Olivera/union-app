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
    if (!validateAll()) return;
    clearError();
    await login(fields.email, fields.password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bgAccent} pointerEvents="none" />

        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.tagline}>UNION APP</Text>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Ingresa al universo aumentado</Text>
          </View>

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
                ¿Olvidaste tu contraseña? </Text>
            </TouchableOpacity>
          </View>

          {/* Footer siempre visible — no depende de space-between */}
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
  flex: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scroll: {
    // Sin flexGrow: 1 — dejamos que el contenido defina la altura
    // Esto permite que el ScrollView haga scroll si el contenido
    // no entra en pantalla, en lugar de comprimir los elementos
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
    // Sin justifyContent: 'space-between' — causa que elementos
    // queden fuera del viewport en pantallas pequeñas
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
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
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  forgotPasswordText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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