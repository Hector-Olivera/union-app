import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@constants/theme';

type Props = {
  storeName: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
};

// Banner: nombre grande de la tienda con fondo en degradado simulado
// (dos bloques de color superpuestos con opacidad, sin librería de gradiente)
export const BannerSection = ({ storeName, description, primaryColor, secondaryColor }: Props) => {
  return (
    <View style={[styles.container, { backgroundColor: primaryColor }]}>
      <View style={[styles.overlay, { backgroundColor: secondaryColor }]} />
      <Text style={styles.name}>{storeName}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.25,
  },
  name: {
    color: '#fff',
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Typography.sizes.sm,
  },
});