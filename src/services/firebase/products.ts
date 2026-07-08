import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Product, ProductFormData } from '@/types/product';

const productsRef = (storeId: string) =>
  collection(db, 'stores', storeId, 'products');

export const createProduct = async (
  storeId: string,
  data: ProductFormData,
  order: number
): Promise<void> => {
  await addDoc(productsRef(storeId), {
    storeId,
    name: data.name.trim(),
    price: parseFloat(data.price) || 0,
    description: data.description.trim(),
    imageUrl: data.imageUrl || null,
    order,
    createdAt: new Date().toISOString(),
  });
};

export const updateProduct = async (
  storeId: string,
  productId: string,
  data: Partial<ProductFormData>
): Promise<void> => {
  const updates: Record<string, any> = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.price !== undefined) updates.price = parseFloat(data.price) || 0;
  if (data.description !== undefined) updates.description = data.description.trim();
  if (data.imageUrl !== undefined) updates.imageUrl = data.imageUrl;

  await updateDoc(doc(db, 'stores', storeId, 'products', productId), updates);
};

export const deleteProduct = async (
  storeId: string,
  productId: string
): Promise<void> => {
  await deleteDoc(doc(db, 'stores', storeId, 'products', productId));
};

// Suscripción en tiempo real, ordenada por el campo 'order'.
// Cualquier cambio (agregar, editar, borrar) se refleja automáticamente
// en todos los lugares que estén escuchando — dashboard y vista pública.
export const subscribeToProducts = (
  storeId: string,
  callback: (products: Product[]) => void
) => {
  const q = query(productsRef(storeId), orderBy('order', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as Product[];
    callback(products);
  }, (error) => {
    console.error('[products] subscribeToProducts:', error);
    callback([]);
  });
};