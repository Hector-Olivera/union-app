import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQRGenerator } from '@features/qr/hooks/useQRGenerator';
import { QRPreview } from './QRPreview';
import { QRColorPicker } from './QRColorPicker';
import { QRStylePicker } from './QRStylePicker';
import { useAppTheme } from '@hooks/useAppTheme';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

// Pantalla completa del generador de QR.
// Combina el preview en tiempo real con los controles de personalizacion.
// Cada cambio en color o estilo se refleja inmediatamente en el preview
// porque el config viene del hook y el QRPreview lo lee directamente.
export const QRGenerator = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const {
    config, svgRef,
    colorOptions,
    updateColor, updateStyle, updateSecondaryColor,
    handleShare,
    storeName,
  } = useQRGenerator();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>QR de tu tienda</Text>
        <Text style={styles.subtitle}>
          Compartilo para que tus clientes te encuentren en Union App.
        </Text>
      </View>

      {/* Preview en tiempo real */}
      <QRPreview config={config} svgRef={svgRef} />

      {/* Controles de personalización */}
      <QRColorPicker
        options={colorOptions}
        selectedColor={config.color}
        onSelect={updateColor}
      />

    
      {config.style === 'gradient' && (
        <QRColorPicker
          options={colorOptions}
          selectedColor={config.secondaryColor}
          onSelect={updateSecondaryColor}
          label="SEGUNDO COLOR"
        />
      )}

       <QRStylePicker
        selected={config.style}
        onSelect={updateStyle}
      />
  

      {/* Info sobre el QR */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
        <Text style={styles.infoText}>
          Cuando alguien escanea este QR con su cámara, va directo a tu tienda en la web.
          Si lo escanea con Union App, ve tu logo en realidad aumentada.
        </Text>
      </View>

      {/* Botón compartir */}
      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: colors.brand.primary }]}
        onPress={handleShare}
        activeOpacity={0.8}
      >
        <Text style={styles.shareButtonText}>Compartir QR</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
  },
  subtitle: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.md,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  infoTitle: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  infoText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
  shareButton: {
    height: 52,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});