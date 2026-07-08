import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { ProductFormModal } from '../ProductFormModal';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import type { Product, ProductFormData } from '@/types/product';

type Props = {
  products: Product[];
  loading: boolean;
  onAdd: (data: ProductFormData) => Promise<void>;
  onEdit: (productId: string, data: Partial<ProductFormData>) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
};

export const ProductCatalogEditor = ({ products, loading, onAdd, onEdit, onRemove }: Props) => {
  const { colors } = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openCreate = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleSave = async (data: ProductFormData) => {
    if (editingProduct) {
      await onEdit(editingProduct.id, data);
    } else {
      await onAdd(data);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.brand.primary }]}
          onPress={openCreate}
        >
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.emptyText}>Cargando productos...</Text>
      ) : products.length === 0 ? (
        <Text style={styles.emptyText}>
          Todavía no agregaste productos. Tocá "Agregar" para empezar.
        </Text>
      ) : (
        products.map((product) => (
          <View key={product.id} style={styles.row}>
            {product.imageUrl ? (
              <Image source={{ uri: product.imageUrl }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]}>
                <Text style={styles.thumbPlaceholderText}>📦</Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={[styles.price, { color: colors.brand.primary }]}>
                ${product.price.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity onPress={() => openEdit(product)} style={styles.iconButton}>
              <Text style={styles.iconText}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onRemove(product.id)} style={styles.iconButton}>
              <Text style={styles.iconText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <ProductFormModal
        visible={modalVisible}
        editingProduct={editingProduct}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  addButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
  addButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  emptyText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
  },
  thumbPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbPlaceholderText: {
    fontSize: 18,
  },
  info: { flex: 1 },
  name: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  price: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  iconButton: { padding: Spacing.xs },
  iconText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
  },
});