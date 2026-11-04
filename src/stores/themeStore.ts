import { create } from 'zustand';
import { Colors } from '@constants/theme';

// Temas de color para las TIENDAS. El dueño elige uno para su tienda y
// cambia sus acentos y también su fondo.
export type ThemeOption = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string; // fondo de la tienda: un tono muy oscuro del color
};

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'brand',    name: 'Emprenda',   primary: '#1a3662', secondary: '#38BDF8', accent: '#F04438', background: '#0B0F19' },
  { id: 'violet',   name: 'Violeta',    primary: '#6C63FF', secondary: '#FF6584', accent: '#43E8D8', background: '#100E24' },
  { id: 'fire',     name: 'Fuego',      primary: '#FF6B35', secondary: '#F7C59F', accent: '#FFDD57', background: '#1F130D' },
  { id: 'ocean',    name: 'Oceano',     primary: '#0077B6', secondary: '#00B4D8', accent: '#90E0EF', background: '#08141F' },
  { id: 'forest',   name: 'Bosque',     primary: '#2D6A4F', secondary: '#52B788', accent: '#B7E4C7', background: '#0B1812' },
  { id: 'midnight', name: 'Medianoche', primary: '#3A0CA3', secondary: '#7209B7', accent: '#F72585', background: '#0F0A26' },
  { id: 'gold',     name: 'Dorado',     primary: '#B5830A', secondary: '#E9C46A', accent: '#F4A261', background: '#1C1708' },
];

export type ActiveTheme = {
  primary: string;
  secondary: string;
  accent: string;
};

// Colores de la app: fijos, los de la marca. Ya no dependen del usuario.
export const APP_THEME: ActiveTheme = {
  primary:   Colors.brand.primary,
  secondary: Colors.brand.secondary,
  accent:    Colors.brand.accent,
};

type ThemeState = {
  activeTheme: ActiveTheme;
};

export const useThemeStore = create<ThemeState>(() => ({
  activeTheme: APP_THEME,
}));