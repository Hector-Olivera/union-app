import { StyleSheet, View } from 'react-native';
import { CameraView as ExpoCameraView } from 'expo-camera';

type Props = {
  cameraRef: React.RefObject<ExpoCameraView | null>;
  facing: 'front' | 'back';
  onReady: () => void;
  onBarcodeScanned?: (data: { type: string; data: string }) => void;
  children?: React.ReactNode;
  // children ahora va FUERA de la cámara, en un View hermano
};

export const CameraViewComponent = ({
  cameraRef, facing, onReady, onBarcodeScanned, children,
}: Props) => {
  return (
    // El View contenedor es el que permite superponer elementos.
    // La cámara y los overlays son hermanos dentro de este View,
    // no padre e hijo. Los overlays usan position: absolute.
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={onReady}
        onBarcodeScanned={onBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      {/* Children FUERA de ExpoCameraView — encima gracias a position absolute */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: relative implícito — los hijos con position: absolute
    // se posicionan relativo a este contenedor
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
    // absoluteFillObject = { position: 'absolute', top:0, left:0, right:0, bottom:0 }
    // La cámara llena el contenedor como capa base
  },
});