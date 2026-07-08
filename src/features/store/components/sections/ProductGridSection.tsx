import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Product } from '@/types/product';

type Props = {
  primaryColor: string;
  products: Product[];
};

export const ProductGridSection = ({ primaryColor, products }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>

      {products.length === 0 ? (
        <Text style={styles.placeholder}>
          Esta tienda todavía no agregó productos.
        </Text>
      ) : (
        <View style={styles.grid}>
          {products.map((product) => (
            <View key={product.id} style={styles.card}>
              {product.imageUrl ? (
                <Image source={{ uri: product.imageUrl }} style={styles.cardImage} resizeMode="cover" />
              ) : (
                <View style={[styles.cardImage, { backgroundColor: `${primaryColor}15` }]} />
              )}
              <Text style={styles.cardLabel} numberOfLines={1}>{product.name}</Text>
              <Text style={[styles.cardPrice, { color: primaryColor }]}>
                ${product.price.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}
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
  placeholder: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    flexBasis: '48%',
    gap: 4,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.md,
  },
  cardLabel: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  cardPrice: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});