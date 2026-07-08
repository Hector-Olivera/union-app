import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useImageUpload } from '@features/store/hooks/useImageUpload';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  currentUrl?: string;
  onUploaded: (url: string) => void;
  aspectRatio: [number, number];
  label: string;
  folder: string;
  height?: number;
  placeholderIcon?: string;
};

// Campo reutilizable para elegir y subir una imagen.
// Se usa tanto para logo (aspecto 1:1) como banner (aspecto 16:9),
// pasando distintos valores de aspectRatio y height.
export const ImagePickerField = ({
  currentUrl, onUploaded, aspectRatio, label, folder,
  height = 120, placeholderIcon = '🖼',
}: Props) => {
  const { colors } = useAppTheme();
  const { pickAndUpload, uploading, error, clearError } = useImageUpload();

  const handlePress = async () => {
    clearError();
    const url = await pickAndUpload(folder, aspectRatio);
    if (url) onUploaded(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.imageContainer,
          { height, borderColor: `${colors.brand.primary}30` }
        ]}
        onPress={handlePress}
        disabled={uploading}
        activeOpacity={0.8}
      >
        {uploading ? (
          <ActivityIndicator color={colors.brand.primary} />
        ) : currentUrl ? (
          <Image source={{ uri: currentUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>{placeholderIcon}</Text>
            <Text style={styles.placeholderText}>Toca para subir</Text>
          </View>
        )}

        {/* Overlay sutil para indicar que es editable, incluso con imagen puesta */}
        {!uploading && currentUrl && (
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeText}>Cambiar</Text>
          </View>
        )}
      </TouchableOpacity>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  imageContainer: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    gap: 4,
  },
  placeholderIcon: {
    fontSize: 28,
  },
  placeholderText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
  },
  editBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(10,10,26,0.8)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  editBadgeText: {
    color: '#fff',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  errorText: {
    color: Colors.status.error,
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
  },
});