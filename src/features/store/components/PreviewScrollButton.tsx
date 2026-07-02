import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Typography, Radius } from '@constants/theme';

type Props = {
  onPress: () => void;
  mode: 'down' | 'up';
};

// Botón flotante que aparece solo en mobile.
// Al tocarlo, hace scroll hacia la vista previa — 
export const PreviewScrollButton = ({ onPress, mode }: Props) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.brand.primary }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>
        {mode === 'down' ? 'Ver preview ↓' : 'Volver arriba ↑'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    color: '#fff',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});