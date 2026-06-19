import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { QRColorOption } from '@/types/qrGenerator';

type Props = {
  options: QRColorOption[];
  selectedColor: string;
  onSelect: (color: string) => void;
  label?: string;
};

// Selector de color para el QR.
// Cada opción es un círculo de color con el nombre debajo.
// El seleccionado muestra un anillo exterior y un checkmark.
export const QRColorPicker = ({ options, selectedColor, onSelect, label = 'COLOR DEL QR' }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {options.map((option) => {
          const isSelected = option.color === selectedColor;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onSelect(option.color)}
              style={styles.optionContainer}
              activeOpacity={0.7}
            >
              {/* Anillo exterior visible solo cuando está seleccionado */}
              <View style={[
                styles.ring,
                isSelected && { borderColor: option.color, borderWidth: 2 }
              ]}>
                <View style={[styles.dot, { backgroundColor: option.color }]}>
                  {isSelected && (
                    <Text style={styles.check}>✓</Text>
                  )}
                </View>
              </View>
              <Text style={[
                styles.optionLabel,
                isSelected && { color: Colors.dark.text }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  scroll: {
    gap: Spacing.md,
    paddingRight: Spacing.md,
  },
  optionContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ring: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  check: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  optionLabel: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    textAlign: 'center',
  },
});