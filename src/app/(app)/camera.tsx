import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCamera } from '@features/camera/hooks/useCamera';
import { CameraViewComponent } from '@features/camera/components/CameraView';
import { CameraPermission } from '@features/camera/components/CameraPermission';
import { CameraControls } from '@features/camera/components/CameraControls';
import { AROverlayContainer } from '@features/camera/components/overlays/AROverlayContainer';
import { ARCrosshair } from '@features/camera/components/overlays/ARCrosshair';
import { PlayerTag } from '@features/camera/components/overlays/PlayerTag';
import { ScanFrame } from '@features/camera/components/overlays/ScanFrame';
import { Colors, Typography, Spacing, Radius } from '@constants/theme';
import { Linking } from 'react-native';

// Modos disponibles de la cámara
// Cada modo activa un overlay y comportamiento distinto
type CameraMode = 'ar' | 'qr';

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<CameraMode>('ar');
  const {
    cameraRef, facing, isReady, permission,
    setIsReady, toggleFacing, takePicture, requestPermission,
  } = useCamera();

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
      >
        {/* Los overlays viven dentro de CameraViewComponent como children,
            se renderizan encima del feed de la cámara */}
        <AROverlayContainer>

          {mode === 'ar' && (
            <>
              {/* Mira central siempre visible en modo AR */}
              <ARCrosshair />

              {/* PlayerTag de demo — en la Capa 3 vendrá de datos reales */}
              <PlayerTag
                name="Andres"
                level={5}
                position={{ x: 120, y: 180 }}
              />
            </>
          )}

          {mode === 'qr' && (
            <ScanFrame />
          )}

        </AROverlayContainer>
      </CameraViewComponent>

      {/* Selector de modo */}
      <View style={[styles.modeSelector, { bottom: 130 + insets.bottom }]}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'ar' && styles.modeButtonActive]}
          onPress={() => setMode('ar')}
        >
          <Text style={[styles.modeText, mode === 'ar' && styles.modeTextActive]}>
            AR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'qr' && styles.modeButtonActive]}
          onPress={() => setMode('qr')}
        >
          <Text style={[styles.modeText, mode === 'qr' && styles.modeTextActive]}>
            QR
          </Text>
        </TouchableOpacity>
      </View>

      <CameraControls
        onFlip={toggleFacing}
        onCapture={takePicture}
        mode={mode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
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
  modeButtonActive: {
    backgroundColor: Colors.brand.primary,
  },
  modeText: {
    color: Colors.dark.icon,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    letterSpacing: 2,
  },
  modeTextActive: {
    color: '#fff',
  },
});