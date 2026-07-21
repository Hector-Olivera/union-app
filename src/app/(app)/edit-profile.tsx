import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { ImagePickerField } from '@features/store/components/ImagePickerField';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { user, updateProfileInfo } = useAuthStore();

  // Separamos displayName en firstName/lastName como mejor esfuerzo
  // si el usuario todavía no los tiene guardados por separado
  const [firstName, setFirstName] = useState(
    user?.firstName || user?.displayName?.split(' ')[0] || ''
  );
  const [lastName, setLastName] = useState(
    user?.lastName || user?.displayName?.split(' ').slice(1).join(' ') || ''
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (firstName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    setError(null);
    setSaving(true);
    await updateProfileInfo(firstName.trim(), lastName.trim(), avatarUrl);
    setSaving(false);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={[styles.backText, { color: colors.brand.primary }]}>← Volver</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Editar perfil</Text>

        <View style={styles.avatarSection}>
          <ImagePickerField
            currentUrl={avatarUrl}
            onUploaded={setAvatarUrl}
            aspectRatio={[1, 1]}
            label="FOTO DE PERFIL (OPCIONAL)"
            folder="union-app/avatars"
            height={100}
            placeholderIcon="👤"
          />
        </View>

        <Text style={styles.label}>NOMBRE</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Tu nombre"
          placeholderTextColor={Colors.dark.icon}
          maxLength={30}
        />

        <Text style={styles.label}>APELLIDO</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Tu apellido"
          placeholderTextColor={Colors.dark.icon}
          maxLength={30}
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.brand.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>{saving ? 'Guardando...' : 'Guardar cambios'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  backButton: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm },
  backText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.lg,
  },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.md },
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
  errorText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.sm,
  },
  saveButton: {
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  saveText: { color: '#fff', fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold },
});