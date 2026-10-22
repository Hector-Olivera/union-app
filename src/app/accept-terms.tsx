import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { acceptTerms } from '@services/firebase/legal';
import { LEGAL } from '@constants/legal';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

export default function AcceptTermsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { user, setUser, signOut } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleAccept = async () => {
    if (!checked) return;
    setSaving(true);
    setError(null);
    try {
      await acceptTerms(user.id);
      // El efecto del layout raíz detecta la aceptación y navega a la app
      setUser({ ...user, termsAcceptedVersion: LEGAL.termsVersion });
    } catch (e) {
      console.error('[AcceptTerms] error:', e);
      setError('No pudimos guardar tu aceptación. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <Text style={[styles.tagline, { color: colors.brand.primary }]}>
            {LEGAL.appName.toUpperCase()}
          </Text>
          <Text style={styles.title}>Antes de continuar</Text>
          <Text style={styles.subtitle}>
            Para usar la app necesitás aceptar los Términos y Condiciones y la Política de Privacidad.
          </Text>

          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/terms' as any)}>
            <Text style={styles.linkText}>Leer Términos y Condiciones   </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.dark.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/privacy' as any)}>
            <Text style={styles.linkText}>Leer Política de Privacidad  </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.dark.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkRow} onPress={() => setChecked(c => !c)} activeOpacity={0.7}>
            <Ionicons
              name={checked ? 'checkbox' : 'square-outline'}
              size={24}
              color={checked ? colors.brand.primary : Colors.dark.icon}
            />
            <Text style={styles.checkText}>
              Leí y acepto los Términos y Condiciones y la Política de Privacidad.
            </Text>
          </TouchableOpacity>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[
              styles.acceptButton,
              { backgroundColor: colors.brand.primary },
              (!checked || saving) && styles.acceptButtonDisabled,
            ]}
            onPress={handleAccept}
            disabled={!checked || saving}
          >
            <Text style={styles.acceptText}>{saving ? 'Guardando...' : 'Aceptar y continuar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.signOutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xl },
  inner: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  tagline: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, letterSpacing: 4, marginBottom: Spacing.sm },
  title: { color: Colors.dark.text, fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold, marginBottom: Spacing.sm },
  subtitle: { color: Colors.dark.icon, fontSize: Typography.sizes.md, lineHeight: 22, marginBottom: Spacing.xl },
  linkRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  linkText: { color: Colors.dark.text, fontSize: Typography.sizes.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xl, marginBottom: Spacing.lg },
  checkText: { flex: 1, color: Colors.dark.text, fontSize: Typography.sizes.sm, lineHeight: 20 },
  errorText: { color: Colors.status.error, fontSize: Typography.sizes.xs, marginBottom: Spacing.sm },
  acceptButton: { height: 52, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  acceptButtonDisabled: { opacity: 0.4 },
  acceptText: { color: '#fff', fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold },
  signOutButton: { alignItems: 'center', paddingVertical: Spacing.lg },
  signOutText: { color: Colors.dark.icon, fontSize: Typography.sizes.sm },
});