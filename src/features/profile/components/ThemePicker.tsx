import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME_OPTIONS } from '@stores/themeStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { Typography, Spacing, Radius, Colors } from '@constants/theme';

type Props = {
  selectedThemeId: string;
  onSelect: (themeId: string) => void;
};

export const ThemePicker = ({ selectedThemeId, onSelect }: Props) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tema de color</Text>
      <Text style={styles.subtitle}>Se aplica en toda la aplicación</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {THEME_OPTIONS.map((theme) => {
          const isSelected = theme.id === selectedThemeId;
          return (
            <TouchableOpacity
              key={theme.id}
              onPress={() => onSelect(theme.id)}
              style={[
                styles.themeItem,
                isSelected && {
                  borderColor: colors.brand.primary,
                  borderWidth: 2,
                }
              ]}
              activeOpacity={0.8}
            >
              {/* Preview de los 3 colores del tema */}
              <View style={styles.colorPreview}>
                <View style={[styles.colorDot, { backgroundColor: theme.primary }]} />
                <View style={[styles.colorDot, { backgroundColor: theme.secondary }]} />
                <View style={[styles.colorDot, { backgroundColor: theme.accent }]} />
              </View>

              <Text style={[
                styles.themeName,
                isSelected && { color: colors.brand.primary }
              ]}>
                {theme.name}
              </Text>

              {/* Checkmark si está seleccionado */}
              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: colors.brand.primary }]}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
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
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  scroll: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  themeItem: {
    width: 80,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: Spacing.sm,
    gap: 6,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  themeName: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});