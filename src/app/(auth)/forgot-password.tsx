import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '@hooks/useAppTheme';
import { resetPassword } from '@services/firebase/auth';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresá un email válido');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e: any) {
      // Por seguridad, Firebase a veces no distingue "email no existe"
      // para evitar que alguien use esto para verificar cuentas existentes
      setError('No pudimos enviar el mail. Verificá la dirección.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={[styles.backText, { color: colors.brand.primary }]}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Recuperar contraseña</Text>

        {sent ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              Te enviamos un mail a {email} con instrucciones para recuperar tu contraseña.
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={[styles.link, { color: colors.brand.primary }]}>Volver al login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Ingresá tu email y te enviamos un link para crear una nueva contraseña.
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={Colors.dark.icon}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.brand.primary }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>{loading ? 'Enviando...' : 'Enviar mail'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.dark.background 
  },
  backButton: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.sm },
  backText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  content: { paddingHorizontal: Spacing.xl, gap: Spacing.md, marginTop: Spacing.xl },
  title: { color: Colors.dark.text, fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold, marginBottom: Spacing.sm },
  subtitle: { color: Colors.dark.icon, fontSize: Typography.sizes.md, lineHeight: 22, marginBottom: Spacing.lg },
  input: {
    height: 48, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.md, paddingHorizontal: Spacing.md,
    color: Colors.dark.text, fontSize: Typography.sizes.md, marginBottom: Spacing.sm,
  },
  errorText: { color: Colors.status.error, fontSize: Typography.sizes.xs, marginBottom: Spacing.sm },
  submitButton: { height: 48, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#fff', fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold },
  successBox: { gap: Spacing.md },
  successText: { color: Colors.dark.text, fontSize: Typography.sizes.md, lineHeight: 22 },
  link: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
});