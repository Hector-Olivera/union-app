import { useState, useEffect } from 'react';
import {
  createProduct, updateProduct, deleteProduct, subscribeToProducts,
} from '@services/firebase/products';
import type { Product, ProductFormData } from '@/types/product';

export const useProducts = (storeId: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) {
      setProducts([]);
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToProducts(storeId, (data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [storeId]);

  const add = async (data: ProductFormData) => {
    if (!storeId) return;
    // El nuevo producto va al final del orden actual
    const nextOrder = products.length > 0
      ? Math.max(...products.map(p => p.order)) + 1
      : 0;
    await createProduct(storeId, data, nextOrder);
  };

  const edit = async (productId: string, data: Partial<ProductFormData>) => {
    if (!storeId) return;
    await updateProduct(storeId, productId, data);
  };

  const remove = async (productId: string) => {
    if (!storeId) return;
    await deleteProduct(storeId, productId);
  };

  return { products, loading, add, edit, remove };
};