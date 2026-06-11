import { useState, useCallback, useRef } from 'react';
import { resolveQRContent } from '@services/qr/qrResolver';
import type { QRScanResult } from '@/types/qr';

type UseQRScannerReturn = {
  lastScan: QRScanResult | null;
  isProcessing: boolean;
  handleBarCodeScanned: (data: { type: string; data: string }) => void;
  clearScan: () => void;
};

export const useQRScanner = (): UseQRScannerReturn => {
  const [lastScan, setLastScan] = useState<QRScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // cooldownRef evita que el mismo QR se procese múltiples veces
  // seguidas mientras está en el encuadre de la cámara.
  // useRef porque no necesitamos re-render cuando cambia.
  const cooldownRef = useRef(false);

  const handleBarCodeScanned = useCallback(
    ({ data }: { type: string; data: string }) => {

      // Si estamos en cooldown o procesando, ignorar
      if (cooldownRef.current || isProcessing) return;

      // Activar cooldown de 2 segundos
      cooldownRef.current = true;
      setIsProcessing(true);

      const payload = resolveQRContent(data);
      const result: QRScanResult = {
        raw: data,
        payload,
        scannedAt: new Date(),
      };

      setLastScan(result);
      setIsProcessing(false);

      // Levantar el cooldown después de 2 segundos
      setTimeout(() => {
        cooldownRef.current = false;
      }, 2000);
    },
    [isProcessing]
  );

  const clearScan = useCallback(() => {
    setLastScan(null);
    cooldownRef.current = false;
  }, []);

  return { lastScan, isProcessing, handleBarCodeScanned, clearScan };
};