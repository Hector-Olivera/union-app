// Un solo lugar para cambiar el look de toda la app
export const Colors = {
  primary: '#6C63FF',    // violeta principal
  secondary: '#FF6584',  // acento rosa
  background: '#0a0a0a', // fondo oscuro
  surface: '#1a1a2e',    // superficies (cards, modales)
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0B0',
    muted: '#606070',
  },
  ar: {
    overlay: 'rgba(108, 99, 255, 0.3)', // color de elementos AR
    highlight: 'rgba(255, 101, 132, 0.5)',
  },
  status: {
    success: '#4CAF50',
    error: '#FF5252',
    warning: '#FFC107',
  },
} as const;
// "as const" hace que TypeScript trate estos valores como literales exactos,
// no como strings genéricos. Previene typos en tiempo de desarrollo.

export const Typography = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    display: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;