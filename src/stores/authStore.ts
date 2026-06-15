import { create } from 'zustand';
import {
  loginUser,
  registerUser,
  logoutUser,
  subscribeToAuthChanges,
} from '@services/firebase/auth';

export type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  // Acciones
  initialize: () => () => void; // devuelve el unsubscribe
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  loading:         true,
  error:           null,
  isAuthenticated: false,

  // Inicia el observer de Firebase. Se llama una vez al arrancar la app.
  // Devuelve unsubscribe para limpiar cuando la app se cierra.
  initialize: () => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      set({ user, isAuthenticated: !!user, loading: false });
    });
    return unsubscribe;
  },

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const user = await loginUser(email, password);
      set({ user, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  register: async (email, password, displayName) => {
    try {
      set({ loading: true, error: null });
      const user = await registerUser(email, password, displayName);
      set({ user, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  
    signOut: async () => {
    try {
      await logoutUser();
      // Forzamos la limpieza del estado local inmediatamente
      // sin esperar al observer — más rápido y confiable
      set({ user: null, isAuthenticated: false, loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
  clearError: () => set({ error: null }),
}));