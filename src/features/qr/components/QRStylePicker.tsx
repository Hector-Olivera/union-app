import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { QRStyle } from '@/types/qrGenerator';

type Props = {
  selected: QRStyle;
  onSelect: (style: QRStyle) => void;
};

const STYLE_OPTIONS: { id: QRStyle; label: string; description: string }[] = [
  { id: 'solid',    label: 'Sólido',    description: 'Color único — máxima legibilidad' },
  { id: 'gradient', label: 'Degradado', description: 'Efecto de color suave' },
];

// Selector de estilo visual del QR.
// Dos opciones presentadas como cards con label y descripción.
// El estilo "dots" requiere que enableLinearGradient esté disponible
// en react-native-qrcode-svg — lo verificamos en el componente de preview.
export const QRStylePicker = ({ selected, onSelect }: Props) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ESTILO DEL QR</Text>
      <View style={styles.options}>
        {STYLE_OPTIONS.map((option) => {
          const isSelected = option.id === selected;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={[
                styles.card,
                isSelected && {
                  borderColor: colors.brand.primary,
                  backgroundColor: `${colors.brand.primary}10`,
                }
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.cardLabel,
                isSelected && { color: colors.brand.primary }
              ]}>
                {option.label}
              </Text>
              <Text style={styles.cardDesc}>{option.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  options: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: Spacing.md,
    gap: 4,
  },
  cardLabel: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  cardDesc: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    lineHeight: 16,
  },
});