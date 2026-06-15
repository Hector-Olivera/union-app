import { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@services/firebase/config';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';

export const useProfile = () => {
  const { user, setUser } = useAuthStore();
  const { setTheme, selectedThemeId } = useThemeStore();
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

  const activateStore = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await setDoc(doc(db, 'players', user.id), {
        hasStore: true,
        // storeId se genera cuando el usuario configura su tienda
        // por ahora solo marcamos la intención
        storeCreatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const changeTheme = async (themeId: string) => {
    if (!user) return;
    // setTheme ya hace la actualización optimista + guarda en Firestore
    await setTheme(themeId, user.id);
  };

  return {
    user,
    saving,
    error,
    selectedThemeId,
    updateDisplayName,
    activateStore,
    changeTheme,
    clearError: () => setError(null),
  };
};