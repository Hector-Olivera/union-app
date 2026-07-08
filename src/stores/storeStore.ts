import { create } from 'zustand';
import { 
  getUserStore, createStore, updateStore, updateStoreLayout,
  updateBusinessHours, updateTodos, updateAnnouncements,
 } from '@services/firebase/store';
import type {
   Store, StoreSection, BusinessHours, TodoItem, Announcement,
 } from '@/types/store';
 import { DEFAULT_BUSINESS_HOURS } from '@/types/store';

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
  updateHours: (hours: BusinessHours) => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (todoId: string) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  addAnnouncement: (text: string) => Promise<void>;
  deleteAnnouncement: (announcementId: string) => Promise<void>;
  updateLogoUrl: (url: string) => Promise<void>;
  updateBannerUrl: (url: string) => Promise<void>;
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

  updateHours: async (hours) => {
  const { store } = get();
  if (!store) return;
  set({ store: { ...store, businessHours: hours } });
  await updateBusinessHours(store.id, hours);
},

addTodo: async (text) => {
  const { store } = get();
  if (!store || !text.trim()) return;
  const newTodo: TodoItem = {
    id: Date.now().toString(),
    // Date.now() como ID es suficiente acá — no hay concurrencia real
    // de múltiples dispositivos escribiendo al mismo tiempo en un MVP
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  const updatedTodos = [...(store.todos || []), newTodo];
  set({ store: { ...store, todos: updatedTodos } });
  await updateTodos(store.id, updatedTodos);
},

toggleTodo: async (todoId) => {
  const { store } = get();
  if (!store) return;
  const updatedTodos = (store.todos || []).map(t =>
    t.id === todoId ? { ...t, done: !t.done } : t
  );
  set({ store: { ...store, todos: updatedTodos } });
  await updateTodos(store.id, updatedTodos);
},

deleteTodo: async (todoId) => {
  const { store } = get();
  if (!store) return;
  const updatedTodos = (store.todos || []).filter(t => t.id !== todoId);
  set({ store: { ...store, todos: updatedTodos } });
  await updateTodos(store.id, updatedTodos);
},

addAnnouncement: async (text) => {
  const { store } = get();
  if (!store || !text.trim()) return;
  const newAnnouncement: Announcement = {
    id: Date.now().toString(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  // Las novedades más recientes van primero
  const updated = [newAnnouncement, ...(store.announcements || [])];
  set({ store: { ...store, announcements: updated } });
  await updateAnnouncements(store.id, updated);
},

deleteAnnouncement: async (announcementId) => {
  const { store } = get();
  if (!store) return;
  const updated = (store.announcements || []).filter(a => a.id !== announcementId);
  set({ store: { ...store, announcements: updated } });
  await updateAnnouncements(store.id, updated);
},

updateLogoUrl: async (url) => {
  const { store } = get();
  if (!store) return;
  set({ store: { ...store, logoUrl: url } });
  await updateStore(store.id, { logoUrl: url });
},

updateBannerUrl: async (url) => {
  const { store } = get();
  if (!store) return;
  set({ store: { ...store, bannerUrl: url } });
  await updateStore(store.id, { bannerUrl: url });
},

  clearStore: () => set({ store: null }),
}));