import { View, Text, Image, StyleSheet } from 'react-native';
import { LEGAL } from '@constants/legal';
import { Colors, Typography, Spacing } from '@constants/theme';

type Props = {
  size?: number;       // lado del logo en px
  textSize?: number;
  uppercase?: boolean; // EMPRENDA YA en vez de Emprenda ya
};

// Logo + nombre de la app. Usa el mismo ícono de la app (fondo rojo de la marca)
export const BrandLogo = ({ size = 36, textSize = Typography.sizes.lg, uppercase = false }: Props) => {
  const name = uppercase ? LEGAL.appName.toUpperCase() : LEGAL.appName;

  return (
    <View style={styles.row}>
      <Image
        source={require('../../../assets/images/icon3sf.png')}
        style={{ width: size, height: size, borderRadius: size * 0.22 }}
        resizeMode="cover"
      />
      <Text
        style={[styles.name, { fontSize: textSize, letterSpacing: uppercase ? 2 : 0 }]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  name: { color: Colors.brand.primary, fontWeight: Typography.weights.bold, flexShrink: 1 },
});