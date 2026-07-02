import { useWindowDimensions, Platform } from 'react-native';

// Determina si la pantalla actual debe usar layout dividido (split)
// o layout apilado (stacked, con scroll).
// Web con ancho suficiente → split. Mobile o web angosta → stacked.
export const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();
  // useWindowDimensions es reactivo — si el usuario resize la ventana
  // del navegador, el valor se actualiza automáticamente

  const isWeb = Platform.OS === 'web';
  const isWideEnough = width >= 768;
  // 768px es el breakpoint clásico de tablet/desktop

  return {
    useSplitLayout: isWeb && isWideEnough,
    isWeb,
  };
};