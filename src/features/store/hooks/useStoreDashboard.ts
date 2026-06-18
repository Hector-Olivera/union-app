import { useState } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useStoreStore } from '@stores/storeStore';

export const useStoreDashboard = () => {
  const { user } = useAuthStore();
  const {
    store, loading, error,
    activateStore, updateStoreName,
    updateStoreDescription, updateLayout,
  } = useStoreStore();

  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const handleActivate = async () => {
    // Validación local antes de llamar a Firebase
    if (nameInput.trim().length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    if (nameInput.trim().length > 40) {
      setNameError('El nombre no puede superar los 40 caracteres');
      return;
    }
    setNameError(null);
    if (!user) return;
    await activateStore(user.id, nameInput.trim());
  };

  return {
    user,
    store,
    loading,
    error,
    nameInput,
    nameError,
    setNameInput,
    handleActivate,
    updateStoreName,
    updateStoreDescription,
    updateLayout,
    updateStoreTheme: useStoreStore().updateStoreTheme,
  };
};