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

export default function RegisterScreen() {
  const { register, loading, error, clearError } = useAuthStore();
  const { fields, errors, touchField, updateField, validateAll } = useAuthForm('register');

  const handleRegister = async () => {
    if (!validateAll()) return;
    clearError();
    await register(fields.email, fields.password, fields.displayName || '');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.bgAccent} pointerEvents="none" />
        <View style={styles.bgAccentSecondary} pointerEvents="none" />

        <View style={styles.container}>

          {/* Header con back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.tagline}>UNION APP</Text>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Unite al universo aumentado
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Nombre de jugador"
              value={fields.displayName || ''}
              onChangeText={(v) => updateField('displayName', v)}
              onBlur={() => touchField('displayName')}
              error={errors.displayName}
              placeholder="Como te van a ver los demás"
              autoCapitalize="words"
            />
            <AuthInput
              label="Email"
              value={fields.email}
              onChangeText={(v) => updateField('email', v)}
              onBlur={() => touchField('email')}
              error={errors.email}
              placeholder="tu@email.com"
              keyboardType="email-address"
            />
            <AuthInput
              label="Contraseña"
              value={fields.password}
              onChangeText={(v) => updateField('password', v)}
              onBlur={() => touchField('password')}
              error={errors.password}
              placeholder="Minimo 6 caracteres"
              secureTextEntry
            />
            <AuthInput
              label="Confirmar contraseña"
              value={fields.confirmPassword || ''}
              onChangeText={(v) => updateField('confirmPassword', v)}
              onBlur={() => touchField('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="Repeti tu contraseña"
              secureTextEntry
            />

            {!!error && (
              <View style={styles.firebaseError}>
                <Text style={styles.firebaseErrorText}>{error}</Text>
              </View>
            )}

            <AuthButton
              label="Crear cuenta"
              onPress={handleRegister}
              loading={loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tenés cuenta? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            {/* replace en lugar de push — no queremos que register quede
                en el historial al volver al login */}
              <Text style={styles.footerLink}>Iniciá sesión</Text>
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
    position: 'absolute',
    top: -100,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.brand.primary,
    opacity: 0.07,
  },
  bgAccentSecondary: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.brand.secondary,
    opacity: 0.06,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    marginBottom: Spacing.lg,
    alignSelf: 'flex-start',
  },
  backText: {
    color: Colors.brand.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  tagline: {
    color: Colors.brand.secondary,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.md,
  },
  form: { marginBottom: Spacing.lg },
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.md,
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