import { create } from 'zustand';

// Define la forma del objeto usuario
export type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
};

// Define todas las propiedades y acciones del store
type AuthState = {
  user: User | null;       // null = no hay sesión
  loading: boolean;        // true mientras verifica sesión al arrancar
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  // !!user convierte el objeto a boolean: si hay user = true, si es null = false

  setLoading: (loading) => set({ loading }),

  signOut: () => set({ user: null, isAuthenticated: false }),
}));