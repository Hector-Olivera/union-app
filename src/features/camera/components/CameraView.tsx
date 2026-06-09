import { StyleSheet, View } from 'react-native';
import { CameraView as ExpoCameraView } from 'expo-camera';
import { Colors } from '@constants/theme';

// Renombramos el import para no colisionar con el nombre de nuestro archivo
// "ExpoCameraView" es el componente nativo de expo-camera
// "CameraView.tsx" es nuestro wrapper con los controles integrados

type Props = {
  cameraRef: React.RefObject<ExpoCameraView | null>;
  facing: 'front' | 'back';
  onReady: () => void;
  children?: React.ReactNode;
  // children permite que el padre inyecte overlays AR encima de la cámara
  // Así en la Capa 2 simplemente pasamos el overlay como hijo
};

export const CameraViewComponent = ({
  cameraRef,
  facing,
  onReady,
  children,
}: Props) => {
  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={onReady}
        // onCameraReady dispara cuando el hardware de la cámara
        // terminó de inicializarse y está listo para recibir comandos
      >
        {/* Los children se renderizan encima de la cámara — para los overlays AR */}
        {children}
      </ExpoCameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  camera: {
    flex: 1,
    // flex: 1 hace que la cámara ocupe todo el espacio disponible
    // El viewport de la cámara se adapta al tamaño del contenedor
  },
});