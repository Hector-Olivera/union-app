import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

export const EmailVerificationBanner = () => {
  const { user, resendVerification } = useAuthStore();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user || user.emailVerified) return null;
  // Si ya está verificado, el banner no se muestra — es autocontenido

  const handleResend = async () => {
    setSending(true);
    await resendVerification();
    setSending(false);
    setSent(true);
  };

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        {sent
          ? 'Te enviamos un mail de verificación. Revisá tu bandeja de entrada.'
          : 'Tu email todavía no está verificado.'}
      </Text>
      {!sent && (
        <TouchableOpacity onPress={handleResend} disabled={sending}>
          <Text style={styles.link}>
            {sending ? 'Enviando...' : 'Reenviar verificación'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(255,193,7,0.1)',
    borderWidth: 1,
    borderColor: Colors.status.warning,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  text: {
    color: Colors.status.warning,
    fontSize: Typography.sizes.sm,
  },
  link: {
    color: Colors.status.warning,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    textDecorationLine: 'underline',
  },
});