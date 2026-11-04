import { Platform } from 'react-native';

// ─── COLORES ────────────────────────────────────────────────────────────────
// Soporte light/dark nativo + paleta de la app (marca) + colores de estado (success, error, warning, info).
const tintColorLight = '#CB0B0B';
const tintColorDark  = '#38BDF8';

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
    text:           '#F1F5F9', // títulos y datos principales
    background:     '#0B0F19', // fondo general
    tint:           tintColorDark,
    icon:           '#94A3B8', // texto secundario e íconos inactivos
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorDark,
    surface:        '#1E293B', // tarjetas, modales y barra de pestañas
    border:         '#334155',
  },

  // Paleta fija de la marca. Los temas de colores son solo para las tiendas.
  // Regla de uso sobre fondo oscuro:
  //   primary   = RELLENO (botones y badges con texto blanco)
  //   secondary = texto, íconos activos, bordes y enlaces
  brand: {
    primary:   '#CB0B0B',
    secondary: '#38BDF8',
    accent:    '#7DD3FC',
  },
  ar: {
    overlay:   'rgba(203, 11, 11, 0.3)',
    highlight: 'rgba(56, 189, 248, 0.5)',
    scan:      'rgba(56, 189, 248, 0.4)',
  },
  status: {
    success: '#4CAF50',
    error:   '#FF5252',
    warning: '#FFC107',
    info:    '#2196F3',
  },
} as const;
// "as const" → TypeScript trata cada valor como literal exacto.
// Colors.brand.primary es '#CB0B0B', no string genérico.
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