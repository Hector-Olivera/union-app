import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCamera } from '@features/camera/hooks/useCamera';
import { useQRScanner } from '@features/camera/hooks/useQRScanner';
import { CameraViewComponent } from '@features/camera/components/CameraView';
import { CameraPermission } from '@features/camera/components/CameraPermission';
import { CameraControls } from '@features/camera/components/CameraControls';
import { AROverlayContainer } from '@features/camera/components/overlays/AROverlayContainer';
import { ARCrosshair } from '@features/camera/components/overlays/ARCrosshair';
import { ScanFrame } from '@features/camera/components/overlays/ScanFrame';
import { PlayerTag } from '@features/camera/components/overlays/PlayerTag';
import { QRResultOverlay } from '@features/camera/components/overlays/QRResultOverlay';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';

type CameraMode = 'ar' | 'qr';

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<CameraMode>('ar');
  const {
    cameraRef, facing, isReady, permission,
    setIsReady, toggleFacing, takePicture, requestPermission,
  } = useCamera();
  const { lastScan, handleBarCodeScanned, clearScan } = useQRScanner();

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted && !permission.canAskAgain) {
    return <CameraPermission isDenied onRequestPermission={() => Linking.openSettings()} />;
  }

  if (!permission.granted) {
    return <CameraPermission onRequestPermission={requestPermission} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <CameraViewComponent
        cameraRef={cameraRef}
        facing={facing}
        onReady={() => setIsReady(true)}
        // Solo activamos el scanner cuando estamos en modo QR.
        // En modo AR no necesitamos procesar barcodes — ahorra CPU.
        onBarcodeScanned={mode === 'qr' ? handleBarCodeScanned : undefined}
      >
        <AROverlayContainer>

          {mode === 'ar' && (
            <>
              <ARCrosshair />
              <PlayerTag name="Andres" level={5} position={{ x: 120, y: 180 }} />
            </>
          )}

          {mode === 'qr' && !lastScan && <ScanFrame />}

          {lastScan && (
            <QRResultOverlay result={lastScan} onDismiss={clearScan} />
          )}

        </AROverlayContainer>
      </CameraViewComponent>

      <View style={[styles.modeSelector, { bottom: 130 + insets.bottom }]}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'ar' && styles.modeButtonActive]}
          onPress={() => { setMode('ar'); clearScan(); }}
        >
          <Text style={[styles.modeText, mode === 'ar' && styles.modeTextActive]}>AR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'qr' && styles.modeButtonActive]}
          onPress={() => setMode('qr')}
        >
          <Text style={[styles.modeText, mode === 'qr' && styles.modeTextActive]}>QR</Text>
        </TouchableOpacity>
      </View>

      <CameraControls onFlip={toggleFacing} onCapture={takePicture} mode={mode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  modeSelector: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(10,10,10,0.7)',
    borderRadius: Radius.full,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modeButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  modeButtonActive: { backgroundColor: Colors.brand.primary },
  modeText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    letterSpacing: 2,
  },
  modeTextActive: { color: '#fff' },
});