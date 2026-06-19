import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '@hooks/useAppTheme';
import { ThemePicker } from '@features/profile/components/ThemePicker';
import { LayoutEditor } from './LayoutEditor';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Store } from '@/types/store';

type Props = {
  store: Store;
  onUpdateLayout: (layout: any) => void;
  onUpdateTheme: (themeId: string) => void;
};

// Dashboard principal de la tienda activa.
// Desde acá el usuario gestiona su tienda: tema, layout y QR.
// Está pensado para crecer — cada sección puede convertirse en
// una pantalla dedicada cuando tenga más funcionalidad.
export const StoreDashboard = ({ store, onUpdateLayout, onUpdateTheme }: Props) => {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header de la tienda */}
      <View style={styles.header}>
        <View>
          <Text style={styles.storeName}>{store.name}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: store.isPublic ? `${colors.brand.accent}20` : 'rgba(255,255,255,0.06)' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: store.isPublic ? colors.brand.accent : Colors.dark.icon }
            ]}>
              {store.isPublic ? '● Pública' : '○ Privada'}
            </Text>
          </View>
        </View>

        {/* Botón QR — placeholder por ahora */}
        <TouchableOpacity
          style={[styles.qrButton, { borderColor: colors.brand.primary }]}
          onPress={() => router.push('/(app)/qrgenerator')}
        >
          <Text style={[styles.qrButtonText, { color: colors.brand.primary }]}>
            Ver QR
          </Text>
        </TouchableOpacity>
      </View>

      {/* Separador */}
      <View style={styles.divider} />

      {/* Tema de la tienda */}
      <ThemePicker
        selectedThemeId={store.themeId}
        onSelect={onUpdateTheme}
      />

      <View style={styles.divider} />

      {/* Editor de layout */}
      <LayoutEditor
        layout={store.layout}
        onUpdate={onUpdateLayout}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  storeName: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  qrButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  qrButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: Spacing.lg,
  },
});