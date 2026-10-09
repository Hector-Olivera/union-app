import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME_OPTIONS } from '@stores/themeStore';
import { useAppTheme } from '@hooks/useAppTheme';
import { useResponsiveLayout } from '@hooks/useResponsiveLayout';
import { Typography, Spacing, Radius, Colors } from '@constants/theme';

type Props = {
  selectedThemeId: string;
  onSelect: (themeId: string) => void;
};

export const ThemePicker = ({ selectedThemeId, onSelect }: Props) => {
  const { colors } = useAppTheme();
  const { isWeb } = useResponsiveLayout();
  const scrollRef = useRef<ScrollView>(null);
  const currentOffset = useRef(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const maxOffset = Math.max(0, contentWidth - containerWidth);

  const handleScroll = (amount: number) => () => {
    const next = Math.max(0, Math.min(currentOffset.current + amount, maxOffset));
    scrollRef.current?.scrollTo({ x: next, animated: true });
    currentOffset.current = next;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tema de color</Text>
      <Text style={styles.subtitle}>Se aplica en toda la aplicación</Text>

      <View
        style={styles.scrollWrapper}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >        
        {isWeb && (
          <TouchableOpacity style={[styles.arrowButton, { left: 1 }]} onPress={handleScroll(-180)}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
        )}

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        onContentSizeChange={(w) => setContentWidth(w)}
        onScroll={(e) => { currentOffset.current = e.nativeEvent.contentOffset.x; }}
        scrollEventThrottle={16}
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

      {isWeb && (
          <TouchableOpacity style={[styles.arrowButton, { right: 1 }]} onPress={handleScroll(180)}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        )}
      </View>
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
  scrollWrapper: {
    position: 'relative', //*Probando estilo
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  arrowButton: {
    position: 'absolute', //*Probando estilo
    top: '50%', //*Probando estilo
    zIndex: 10, //*Probando estilo
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    transform: [{ translateY: -16 }],
  },
  arrowText: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '700',
  },
});