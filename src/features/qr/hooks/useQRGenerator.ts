import { useState, useRef } from 'react';
import { Share, Platform } from 'react-native';
import { useStoreStore } from '@stores/storeStore';
import {
  DEFAULT_QR_CONFIG,
  QR_COLOR_OPTIONS,
  type QRGeneratorConfig,
  type QRStyle,
} from '@/types/qrGenerator';

export const useQRGenerator = () => {
  const { store } = useStoreStore();
  const svgRef = useRef<any>(null);
  // svgRef permite capturar el QR como imagen para compartirlo

  const [config, setConfig] = useState<QRGeneratorConfig>({
    ...DEFAULT_QR_CONFIG,
    // El valor del QR apunta al scheme de la tienda
    value:     `unionapp://store/${store?.id || 'preview'}`,
    storeName: store?.name || 'Mi Tienda',
  });

  const updateColor = (color: string) => {
    setConfig(prev => ({ ...prev, color }));
  };

  const updateStyle = (style: QRStyle) => {
    setConfig(prev => ({ ...prev, style }));
  };

  const handleShare = async () => {
    try {
      // Por ahora compartimos el texto del scheme
      // En la próxima iteración capturamos el SVG como imagen
      await Share.share({
        message: Platform.OS === 'ios'
          ? config.value
          : `Escaneá mi tienda en Union App: ${config.value}`,
        title: `QR de ${config.storeName}`,
      });
    } catch (error) {
      console.error('[QRGenerator] share error:', error);
    }
  };

  const updateSecondaryColor = (secondaryColor: string) => {
    setConfig(prev => ({ ...prev, secondaryColor }));
  };

  return {
    config,
    svgRef,
    colorOptions: QR_COLOR_OPTIONS,
    updateColor,
    updateSecondaryColor,
    updateStyle,
    handleShare,
    storeName: store?.name || '',
  };
};