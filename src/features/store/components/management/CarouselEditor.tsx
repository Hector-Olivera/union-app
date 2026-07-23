import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useImageUpload } from '@features/store/hooks/useImageUpload';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  images: string[] | undefined;
  onUpdate: (images: string[]) => void;
};

const MAX_IMAGES = 6;

export const CarouselEditor = ({ images = [], onUpdate }: Props) => {
  const { colors } = useAppTheme();
  const { pickAndUpload, uploading } = useImageUpload();

  const handleAdd = async () => {
    if (images.length >= MAX_IMAGES) return;
    const url = await pickAndUpload('union-app/carousel', [16, 9]);
    if (url) onUpdate([...images, url]);
  };

  const handleRemove = (index: number) => {
    onUpdate(images.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrusel de imágenes</Text>
      <Text style={styles.subtitle}>
        Hasta {MAX_IMAGES} imágenes para mostrar en tu tienda ({images.length}/{MAX_IMAGES}).
      </Text>

      {images.map((url, index) => (
        <View key={index} style={styles.row}>
          <Image source={{ uri: url }} style={styles.thumb} />
          <TouchableOpacity onPress={() => handleRemove(index)} style={styles.removeButton}>
            <Text style={styles.removeText}>Quitar</Text>
          </TouchableOpacity>
        </View>
      ))}

      {images.length < MAX_IMAGES && (
        <TouchableOpacity
          style={[styles.addButton, { borderColor: colors.brand.primary }]}
          onPress={handleAdd}
          disabled={uploading}
        >
          <Text style={[styles.addText, { color: colors.brand.primary }]}>
            {uploading ? 'Subiendo...' : '+ Agregar imagen'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  thumb: {
    width: 80,
    height: 45,
    borderRadius: Radius.sm,
  },
  removeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  removeText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.xs,
  },
  addButton: {
    height: 44,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});