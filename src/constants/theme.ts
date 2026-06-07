import { Platform } from 'react-native';

// ─── COLORES ────────────────────────────────────────────────────────────────
// Soporte light/dark nativo + paleta del juego AR
const tintColorLight = '#6C63FF';
const tintColorDark  = '#A89EFF';

export const Colors = {
  // Sistema light/dark (compatible con useColorScheme de Expo)
  light: {
    text:           '#11181C',
    background:     '#FFFFFF',
    tint:           tintColorLight,
    icon:           '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    surface:        '#F5F5F5',
    border:         '#E0E0E0',
  },
  dark: {
    text:           '#ECEDEE',
    background:     '#0a0a0a',
    tint:           tintColorDark,
    icon:           '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    surface:        '#1a1a2e',
    border:         '#2a2a3e',
  },

  // Paleta fija del juego AR (no cambia con el modo)
  brand: {
    primary:   '#6C63FF',
    secondary: '#FF6584',
    accent:    '#43E8D8',
  },
  ar: {
    overlay:   'rgba(108, 99, 255, 0.3)',
    highlight: 'rgba(255, 101, 132, 0.5)',
    scan:      'rgba(67, 232, 216, 0.4)',
  },
  status: {
    success: '#4CAF50',
    error:   '#FF5252',
    warning: '#FFC107',
    info:    '#2196F3',
  },
} as const;
// "as const" → TypeScript trata cada valor como literal exacto.
// Colors.brand.primary es '#6C63FF', no string genérico.
// Previene typos y habilita autocompletado preciso.

// ─── TIPOGRAFÍA ──────────────────────────────────────────────────────────────
// Fonts usa Platform.select para devolver la familia correcta según el SO.
// En iOS existen familias del sistema con variantes (rounded, serif, mono).
// En Android y web se mapean a equivalentes estándar.
export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',   // La fuente redondeada de Apple (SF Pro Rounded)
    mono:    'ui-monospace',
  },
  default: {                 // Android
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
});

export const Typography = {
  sizes: {
    xs:      11,
    sm:      13,
    md:      15,
    lg:      17,
    xl:      20,
    xxl:     24,
    display: 32,
  },
  weights: {
    regular:  '400' as const,
    medium:   '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
  },
  fonts: Fonts, // Accesible desde Typography.fonts.sans, etc.
} as const;

// ─── ESPACIADO ───────────────────────────────────────────────────────────────
// Escala de 8pt — estándar en diseño móvil profesional.
// Todos los márgenes y paddings deberían ser múltiplos de 8
// para mantener consistencia visual en toda la app.
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

// ─── BORDES ──────────────────────────────────────────────────────────────────
export const Radius = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   20,
  full: 9999, // Para elementos circulares (avatares, badges)
} as const;