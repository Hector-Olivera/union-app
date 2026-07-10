import { create } from 'zustand';
import {
  loginUser,
  registerUser,
  logoutUser,
  subscribeToAuthChanges,
  updateUserProfile, sendVerificationEmail, reloadCurrentUser,
} from '@services/firebase/auth';

export type User = {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  emailVerified: boolean;
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
  updateProfileInfo: (firstName: string, lastName: string, avatarUrl?: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
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
    updateProfileInfo: async (firstName, lastName, avatarUrl) => {
    const { user } = get();
    if (!user) return;
    const displayName = `${firstName} ${lastName}`.trim();
    await updateUserProfile(user.id, { firstName, lastName, displayName, avatarUrl });
    set({ user: { ...user, firstName, lastName, displayName, avatarUrl: avatarUrl ?? user.avatarUrl } });
  },

  resendVerification: async () => {
    await sendVerificationEmail();
  },

  refreshUser: async () => {
    // Recarga el estado de verificación desde Firebase
    // (necesario porque emailVerified no cambia solo — hay que refrescar)
    const updated = await reloadCurrentUser();
    if (updated) set({ user: updated });
  },
  clearError: () => set({ error: null }),
}));