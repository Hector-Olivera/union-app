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
import { authStyles } from '@features/auth/authStyles'; 

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
      style={authStyles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={authStyles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[authStyles.bgAccent, { pointerEvents: 'none' }]} />
        <View style={[styles.bgAccentSecondary, { pointerEvents: 'none' }]} />

        <View style={authStyles.container}>

          {/* Header con back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>

          <View style={authStyles.header}>
            <Text style={authStyles.tagline}>UNION APP</Text>
            <Text style={authStyles.title}>Crear cuenta</Text>
            <Text style={authStyles.subtitle}>
              Unite al universo aumentado
            </Text>
          </View>

          <View style={authStyles.form}>
            <AuthInput
              label="Nombre de usuario"
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
              <View style={authStyles.firebaseError}>
                <Text style={authStyles.firebaseErrorText}>{error}</Text>
              </View>
            )}

            <AuthButton
              label="Crear cuenta"
              onPress={handleRegister}
              loading={loading}
            />
          </View>

          <View style={authStyles.footer}>
            <Text style={authStyles.footerText}>¿Ya tenés cuenta? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            {/* replace en lugar de push — no queremos que register quede
                en el historial al volver al login */}
              <Text style={authStyles.footerLink}>Iniciá sesión</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  backButton: {
    marginBottom: Spacing.lg,
    alignSelf: 'flex-start',
  },
  backText: {
    color: Colors.brand.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});