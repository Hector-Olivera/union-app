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
      style={authStyles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // iOS y Android manejan el teclado diferente
      // 'padding' en iOS sube el contenido, 'height' en Android reduce el viewport
    >
      <ScrollView
        contentContainerStyle={authStyles.scroll}
        keyboardShouldPersistTaps="handled"
        // "handled" permite que los taps en botones funcionen
        // incluso cuando el teclado está abierto
      >
        {/* Fondo decorativo */}
        <View style={[authStyles.bgAccent, { pointerEvents: 'none' }]}/>

        <View style={authStyles.container}>

          {/* Header */}
          <View style={authStyles.header}>
            <Text style={authStyles.tagline}>UNION APP</Text>
            <Text style={authStyles.title}>Bienvenido</Text>
            <Text style={authStyles.subtitle}>
              Ingresa al universo aumentado
            </Text>
          </View>

          {/* Formulario */}
          <View style={authStyles.form}>
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
              <View style={authStyles.firebaseError}>
                <Text style={authStyles.firebaseErrorText}>{error}</Text>
              </View>
            )}

            <AuthButton
              label="Ingresar"
              onPress={handleLogin}
              loading={loading}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?  </Text>
            </TouchableOpacity>
          </View>

          {/* Footer — navegación a Register */}
          <View style={authStyles.footer}>
            <Text style={authStyles.footerText}>¿No tenés cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={authStyles.footerLink}>Registrate</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  forgotPasswordText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
});