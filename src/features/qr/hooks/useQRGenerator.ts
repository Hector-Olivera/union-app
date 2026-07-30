import { useState, useRef } from 'react';
import { Share, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import type ViewShot from 'react-native-view-shot';
import { useStoreStore } from '@stores/storeStore';
import {
  DEFAULT_QR_CONFIG,
  QR_COLOR_OPTIONS,
  type QRGeneratorConfig,
  type QRStyle,
} from '@/types/qrGenerator';

export const useQRGenerator = () => {
  const { store } = useStoreStore();
  const viewShotRef = useRef<ViewShot>(null);

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
      // capture() convierte la vista en un archivo de imagen temporal
      // y devuelve la ruta local de ese archivo
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `QR de ${config.storeName}`,
        });
      }
    } catch (error) {
      console.error('[QRGenerator] share error:', error);
    }
  };

  const updateSecondaryColor = (secondaryColor: string) => {
    setConfig(prev => ({ ...prev, secondaryColor }));
  };

  return {
    config,
    viewShotRef,
    colorOptions: QR_COLOR_OPTIONS,
    updateColor,
    updateSecondaryColor,
    updateStyle,
    handleShare,
    storeName: store?.name || '',
  };
};