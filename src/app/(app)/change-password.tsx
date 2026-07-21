import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@hooks/useAppTheme';
import { changeUserPassword } from '@services/firebase/auth';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (newPass.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPass !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await changeUserPassword(current, newPass);
      setSuccess(true);
    } catch (e: any) {
      // Mensajes de Firebase traducidos a algo entendible
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('La contraseña actual es incorrecta');
      } else {
        setError('No pudimos cambiar la contraseña. Intentá de nuevo.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={[styles.backText, { color: colors.brand.primary }]}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Cambiar contraseña</Text>

        {success ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>Contraseña actualizada correctamente.</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.link, { color: colors.brand.primary }]}>Volver al perfil</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.label}>CONTRASEÑA ACTUAL</Text>
            <TextInput
              style={styles.input}
              value={current}
              onChangeText={setCurrent}
              secureTextEntry
              placeholderTextColor={Colors.dark.icon}
            />

            <Text style={styles.label}>NUEVA CONTRASEÑA</Text>
            <TextInput
              style={styles.input}
              value={newPass}
              onChangeText={setNewPass}
              secureTextEntry
              placeholderTextColor={Colors.dark.icon}
            />

            <Text style={styles.label}>CONFIRMAR NUEVA CONTRASEÑA</Text>
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholderTextColor={Colors.dark.icon}
            />

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.brand.primary }]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <Text style={styles.saveText}>{saving ? 'Guardando...' : 'Cambiar contraseña'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  backButton: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm },
  backText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  content: { paddingHorizontal: Spacing.xl },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.lg,
  },
  label: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
  },
  errorText: { color: Colors.status.error, fontSize: Typography.sizes.xs, marginTop: Spacing.sm },
  saveButton: {
    height: 48, borderRadius: Radius.md, justifyContent: 'center',
    alignItems: 'center', marginTop: Spacing.lg,
  },
  saveText: { color: '#fff', fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold },
  successBox: { gap: Spacing.md },
  successText: { color: Colors.status.success, fontSize: Typography.sizes.md },
  link: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
});