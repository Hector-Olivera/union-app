import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@services/firebase/config';
import { useAuthStore } from '@stores/authStore';

export const useProfile = () => {
  const { user, setUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDisplayName = async (newName: string) => {
    if (!user) return;
    if (newName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await setDoc(doc(db, 'players', user.id), {
        displayName: newName.trim(),
      }, { merge: true });
      // Actualiza el store local para que la UI refleje el cambio
      // sin necesidad de recargar desde Firestore
      setUser({ ...user, displayName: newName.trim() });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    saving,
    error,
    updateDisplayName,
    clearError: () => setError(null),
  };
};