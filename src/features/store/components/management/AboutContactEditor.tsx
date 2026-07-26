import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Store } from '@/types/store';

type Props = {
  store: Store;
  onUpdateDescription: (description: string) => Promise<void>;
  onUpdateContact: (contact: Store['contact']) => Promise<void>;
};

export const AboutContactEditor = ({ store, onUpdateDescription, onUpdateContact }: Props) => {
  const { colors } = useAppTheme();
  const [description, setDescription] = useState(store.description);
  const [phone, setPhone] = useState(store.contact?.phone || '');
  const [whatsapp, setWhatsapp] = useState(store.contact?.whatsapp || '');
  const [address, setAddress] = useState(store.contact?.address || '');
  const [instagram, setInstagram] = useState(store.contact?.instagram || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateDescription(description);
    await onUpdateContact({ phone, whatsapp, address, instagram });
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Acerca de</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Contale a tus clientes sobre tu negocio..."
        placeholderTextColor={Colors.dark.icon}
        multiline
        maxLength={300}
      />

      <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Contacto</Text>

      <Text style={styles.label}>TELÉFONO</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Ej: 11 2345-6789"
        placeholderTextColor={Colors.dark.icon}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>WHATSAPP</Text>
      <TextInput
        style={styles.input}
        value={whatsapp}
        onChangeText={setWhatsapp}
        placeholder="Ej: 5491123456789"
        placeholderTextColor={Colors.dark.icon}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>DIRECCIÓN</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Ej: Av. Siempre Viva 123"
        placeholderTextColor={Colors.dark.icon}
      />

      <Text style={styles.label}>INSTAGRAM</Text>
      <TextInput
        style={styles.input}
        value={instagram}
        onChangeText={setInstagram}
        placeholder="Ej: @mitienda"
        placeholderTextColor={Colors.dark.icon}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.brand.primary }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>{saving ? 'Guardando...' : 'Guardar cambios'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.sm,
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
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  saveButton: {
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  saveText: { color: '#fff', fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
});