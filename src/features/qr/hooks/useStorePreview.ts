import { useState, useEffect } from 'react';
import { subscribeToStore } from '@services/firebase/store';
import type { Store } from '@/types/store';

// Busca los datos de una tienda por su ID cuando se escanea su QR.
// Separado del resolver porque el resolver solo interpreta el contenido
// crudo del QR — no hace llamadas a la red. Este hook sí.
export const useStorePreview = (storeId: string | null) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!storeId) {
      setStore(null);
      return;
    }
    setLoading(true);

    const unsubscribe = subscribeToStore(storeId, (data) => {
      setStore(data);
      setLoading(false);
    });

    // Cleanup: cancela la suscripción cuando cambia el storeId
    // o el componente se desmonta, evitando memory leaks
    return () => unsubscribe();

    



  }, [storeId]);

  return { store, loading };
};