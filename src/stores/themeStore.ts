import { create } from 'zustand';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@services/firebase/config';

// Paletas predefinidas de la plataforma.
// Cada tema tiene un nombre, color primario, secundario y acento.
// El usuario elige una — se guarda en Firestore y se aplica en tiempo real.
export type ThemeOption = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'violet',   name: 'Violeta',    primary: '#6C63FF', secondary: '#FF6584', accent: '#43E8D8' },
  { id: 'fire',     name: 'Fuego',      primary: '#FF6B35', secondary: '#F7C59F', accent: '#FFDD57' },
  { id: 'ocean',    name: 'Oceano',     primary: '#0077B6', secondary: '#00B4D8', accent: '#90E0EF' },
  { id: 'forest',   name: 'Bosque',     primary: '#2D6A4F', secondary: '#52B788', accent: '#B7E4C7' },
  { id: 'midnight', name: 'Medianoche', primary: '#3A0CA3', secondary: '#7209B7', accent: '#F72585' },
  { id: 'gold',     name: 'Dorado',     primary: '#B5830A', secondary: '#E9C46A', accent: '#F4A261' },
];

// El tema activo — lo que se usa en toda la app
export type ActiveTheme = {
  primary: string;
  secondary: string;
  accent: string;
};

type ThemeState = {
  activeTheme: ActiveTheme;
  selectedThemeId: string;
  loading: boolean;
  // Acciones
  loadUserTheme: (userId: string) => Promise<void>;
  setTheme: (themeId: string, userId: string) => Promise<void>;
  resetTheme: () => void;
};

const DEFAULT_THEME = THEME_OPTIONS[0]; // violet es el default

export const useThemeStore = create<ThemeState>((set) => ({
  activeTheme: {
    primary:   DEFAULT_THEME.primary,
    secondary: DEFAULT_THEME.secondary,
    accent:    DEFAULT_THEME.accent,
  },
  selectedThemeId: DEFAULT_THEME.id,
  loading: false,

  // Carga el tema guardado del usuario desde Firestore al iniciar sesión
  loadUserTheme: async (userId: string) => {
    try {
      const snap = await getDoc(doc(db, 'players', userId));
      if (!snap.exists()) return;

      const data = snap.data();
      const themeId = data.themeId || DEFAULT_THEME.id;
      const theme = THEME_OPTIONS.find(t => t.id === themeId) || DEFAULT_THEME;

      set({
        selectedThemeId: themeId,
        activeTheme: {
          primary:   theme.primary,
          secondary: theme.secondary,
          accent:    theme.accent,
        }
      });
    } catch (error) {
      console.error('[themeStore] loadUserTheme:', error);
    }
  },

  // Cambia el tema en tiempo real Y lo guarda en Firestore
  setTheme: async (themeId: string, userId: string) => {
    const theme = THEME_OPTIONS.find(t => t.id === themeId);
    if (!theme) return;

    // Actualización optimista — primero cambia en UI, luego guarda
    // El usuario ve el cambio inmediatamente sin esperar la red
    set({
      selectedThemeId: themeId,
      activeTheme: {
        primary:   theme.primary,
        secondary: theme.secondary,
        accent:    theme.accent,
      }
    });

    try {
      await setDoc(doc(db, 'players', userId), { themeId }, { merge: true });
    } catch (error) {
      console.error('[themeStore] setTheme:', error);
      // Si falla el guardado, el tema igual queda aplicado localmente
      // En una app de producción acá revertiríamos el estado
    }
  },

  // Resetea al tema default — se llama al cerrar sesión
  resetTheme: () => set({
    selectedThemeId: DEFAULT_THEME.id,
    activeTheme: {
      primary:   DEFAULT_THEME.primary,
      secondary: DEFAULT_THEME.secondary,
      accent:    DEFAULT_THEME.accent,
    }
  }),
}));