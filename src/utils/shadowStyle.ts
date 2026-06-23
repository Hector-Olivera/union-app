import { Platform } from 'react-native';

type ShadowConfig = {
  color: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  radius?: number;
  elevation?: number;
};

// Helper que genera el estilo de sombra correcto según la plataforma.
// En web usa boxShadow (CSS estándar), en native usa las props shadow* + elevation.
// Evita el warning "shadow* style props are deprecated" en web
// sin perder el efecto de sombra en iOS/Android.
export const createShadow = ({
  color, offsetX = 0, offsetY = 4, opacity = 0.3, radius = 8, elevation = 6
}: ShadowConfig) => {
  if (Platform.OS === 'web') {
    // Convertimos opacity (0-1) a un valor hex de alpha para el rgba
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px ${color}${alpha}`,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
};