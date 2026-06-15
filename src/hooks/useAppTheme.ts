import { useThemeStore } from '@stores/themeStore';
import { Colors, Typography, Spacing, Radius, Fonts } from '@constants/theme';

// Este hook reemplaza el import directo de Colors.brand en componentes
// que necesitan reaccionar al cambio de tema del usuario.
// Mezcla los colores estáticos (dark/light/status) con los dinámicos (brand).
export const useAppTheme = () => {
  const { activeTheme } = useThemeStore();

  return {
    // Colores del sistema — no cambian con el tema del usuario
    colors: {
      ...Colors,
      // Sobreescribimos brand con los colores reactivos del store
      brand: {
        primary:   activeTheme.primary,
        secondary: activeTheme.secondary,
        accent:    activeTheme.accent,
      },
    },
    typography: Typography,
    spacing: Spacing,
    radius: Radius,
    fonts: Fonts,
  };
};