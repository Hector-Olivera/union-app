import { create } from 'zustand';
import { getUserStore, createStore, updateStore, updateStoreLayout } from '@services/firebase/store';
import type { Store, StoreSection } from '@/types/store';

type StoreState = {
  store: Store | null;
  loading: boolean;
  error: string | null;
  // Acciones
  loadStore: (userId: string) => Promise<void>;
  activateStore: (userId: string, storeName: string) => Promise<void>;
  updateStoreName: (name: string) => Promise<void>;
  updateStoreDescription: (description: string) => Promise<void>;
  updateStoreTheme: (themeId: string) => Promise<void>;
  updateLayout: (layout: StoreSection[]) => Promise<void>;
  clearStore: () => void;
};

export const useStoreStore = create<StoreState>((set, get) => ({
  store:   null,
  loading: false,
  error:   null,

  loadStore: async (userId) => {
    try {
      set({ loading: true, error: null });
      const store = await getUserStore(userId);
      set({ store, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  activateStore: async (userId, storeName) => {
    try {
      set({ loading: true, error: null });
      const store = await createStore(userId, storeName);
      set({ store, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  updateStoreName: async (name) => {
    const { store } = get();
    if (!store) return;
    // Actualización optimista
    set({ store: { ...store, name } });
    await updateStore(store.id, { name });
  },

  updateStoreDescription: async (description) => {
    const { store } = get();
    if (!store) return;
    set({ store: { ...store, description } });
    await updateStore(store.id, { description });
  },

  updateStoreTheme: async (themeId) => {
    const { store } = get();
    if (!store) return;
    set({ store: { ...store, themeId } });
    await updateStore(store.id, { themeId });
  },

  updateLayout: async (layout) => {
    const { store } = get();
    if (!store) return;
    // Actualización optimista del layout
    set({ store: { ...store, layout } });
    await updateStoreLayout(store.id, layout);
  },

  clearStore: () => set({ store: null }),
}));