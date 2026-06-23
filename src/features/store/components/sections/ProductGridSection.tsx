import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type Props = {
  primaryColor: string;
};

// Grilla de productos: placeholder hasta tener catálogo real.
// Muestra 4 cards vacías para comunicar la estructura visual final.
export const ProductGridSection = ({ primaryColor }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>
      <View style={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.card}>
            <View style={[styles.cardImage, { backgroundColor: `${primaryColor}15` }]} />
            <Text style={styles.cardLabel}>Producto {i}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.placeholder}>
        El catálogo completo estará disponible próximamente.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    flexBasis: '48%',
    gap: 6,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.md,
  },
  cardLabel: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
  placeholder: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.xs,
    textAlign: 'center',
    marginTop: Spacing.sm,
    opacity: 0.7,
  },
});