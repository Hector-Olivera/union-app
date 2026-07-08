export type Product = {
  id: string;
  storeId: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
};

// Datos que el formulario recolecta antes de crear el producto —
// sin id (lo genera Firestore) y sin storeId/order/createdAt (los agrega el servicio)
export type ProductFormData = {
  name: string;
  price: string; // string en el form porque viene de un TextInput,
                  // se convierte a number recién al guardar
  description: string;
  imageUrl?: string;
};