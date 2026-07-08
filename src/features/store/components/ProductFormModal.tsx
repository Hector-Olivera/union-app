import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { ImagePickerField } from './ImagePickerField';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Product, ProductFormData } from '@/types/product';

type Props = {
  visible: boolean;
  editingProduct: Product | null; // null = modo crear, con datos = modo editar
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
};

export const ProductFormModal = ({ visible, editingProduct, onClose, onSave }: Props) => {
  const { colors } = useAppTheme();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cuando se abre el modal, precargamos los datos si estamos editando
  useEffect(() => {
    if (visible) {
      setName(editingProduct?.name || '');
      setPrice(editingProduct ? String(editingProduct.price) : '');
      setDescription(editingProduct?.description || '');
      setImageUrl(editingProduct?.imageUrl);
      setError(null);
    }
  }, [visible, editingProduct]);

  const handleSave = async () => {
    if (name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      setError('Ingresá un precio válido');
      return;
    }
    setError(null);
    setSaving(true);
    await onSave({ name, price, description, imageUrl });
    setSaving(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <Text style={styles.title}>
              {editingProduct ? 'Editar producto' : 'Nuevo producto'}
            </Text>

            <ImagePickerField
              currentUrl={imageUrl}
              onUploaded={setImageUrl}
              aspectRatio={[1, 1]}
              label="FOTO DEL PRODUCTO"
              folder="union-app/products"
              height={140}
              placeholderIcon="📦"
            />

            <Text style={styles.label}>NOMBRE</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ej: Pizza muzzarella"
              placeholderTextColor={Colors.dark.icon}
              maxLength={60}
            />

            <Text style={styles.label}>PRECIO</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor={Colors.dark.icon}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>DESCRIPCIÓN (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ingredientes, detalles..."
              placeholderTextColor={Colors.dark.icon}
              multiline
              maxLength={150}
            />

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.brand.primary }]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.xl,
    maxHeight: '85%',
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
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
    height: 70,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
  saveButton: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});