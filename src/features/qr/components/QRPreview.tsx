import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { QRGeneratorConfig } from '@/types/qrGenerator';
import { createShadow } from '@utils/shadowStyle';

type Props = {
  config: QRGeneratorConfig;
  svgRef: React.RefObject<any>;
};

export const QRPreview = ({ config, svgRef }: Props) => {
  const displayName = config.storeName.length > 25
    ? config.storeName.slice(0, 22) + '...'
    : config.storeName;

    const isGradient = config.style === 'gradient';

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>

        <Text style={[styles.appName, { color: config.color }]}>
          UNION APP
        </Text>

        {/* Contenedor del QR con logo superpuesto manualmente */}
        {/* react-native-qrcode-svg no soporta componentes como logo */}
        {/* Lo superponemos con position: absolute encima del QR */}
        <View style={styles.qrWrapper}>
          <QRCode
            value={config.value}
            size={config.size}
            color={config.color}
            backgroundColor={config.backgroundColor}
            ecl="H"
            // ecl="H" permite hasta 30% del area cubierta
            // necesario para que el logo central no rompa la lectura
            enableLinearGradient={isGradient}
            linearGradient={isGradient ? [config.color, config.secondaryColor] : undefined}
            gradientDirection={['0%', '0%', '100%', '100%']}
            getRef={(ref) => { svgRef.current = ref; }}
            // getRef espera una funcion de callback, no un RefObject
            // asignamos manualmente el ref al current
          />

          {/* Logo Union App superpuesto en el centro */}
          <View style={[
            styles.logoOverlay,
            {
              backgroundColor: config.backgroundColor,
              width: config.logoSize + 8,
              height: config.logoSize + 8,
              borderRadius: (config.logoSize + 8) / 4,
            }
          ]}>
            <View style={[
              styles.logo,
              {
                backgroundColor: config.color,
                width: config.logoSize,
                height: config.logoSize,
                borderRadius: config.logoSize / 4,
              }
            ]}>
              <Text style={[styles.logoText, { fontSize: config.logoSize * 0.5 }]}>
                U
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.storeName, { color: config.color }]}>
          {displayName}
        </Text>

        <Text style={styles.url}>
            union-app.com </Text>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
 card: {
  backgroundColor: '#FFFFFF',
  borderRadius: Radius.lg,
  padding: Spacing.lg,
  alignItems: 'center',
  gap: Spacing.sm,
  ...createShadow({ color: '#000000', offsetY: 4, opacity: 0.3, radius: 8, elevation: 8 }),
},
  appName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 3,
  },
  qrWrapper: {
    // position: relative implícito
    // el logo se posiciona absolute dentro de este contenedor
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoOverlay: {
    // Fondo blanco alrededor del logo para que no tape los módulos del QR
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  storeName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    marginTop: 4,
  },
  url: {
    color: '#999999',
    fontSize: Typography.sizes.xs,
    letterSpacing: 0.5,
  },
});