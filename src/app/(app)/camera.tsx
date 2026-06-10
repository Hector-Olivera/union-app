import { View, StyleSheet, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCamera } from '@features/camera/hooks/useCamera';
import { CameraViewComponent } from '@features/camera/components/CameraView';
import { CameraPermission } from '@features/camera/components/CameraPermission';
import { CameraControls } from '@features/camera/components/CameraControls';
import { Colors } from '@constants/theme';

// Esta pantalla es el orquestador — no tiene lógica propia,
// solo conecta el hook con los componentes visuales.
// Patrón: Container/Presenter — el container maneja estado y lógica,
// los presenters (componentes) solo reciben props y renderizan.

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const {
    cameraRef,
    facing,
    isReady,
    permission,
    setIsReady,
    toggleFacing,
    takePicture,
    requestPermission,
  } = useCamera();

  // --- Estados de permisos ---

  // Null: aún cargando el estado del permiso desde el sistema
  // Mostramos nada para evitar un flash de UI incorrecto
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Permiso denegado permanentemente — hay que ir a Configuración
  // canAskAgain: false cuando el usuario eligió "No volver a preguntar"
  if (!permission.granted && !permission.canAskAgain) {
    return (
      <CameraPermission
        isDenied
        onRequestPermission={() => Linking.openSettings()}
        // Linking.openSettings() abre la app de Configuración del sistema
        // directamente en los permisos de la app
      />
    );
  }

  // Permiso no otorgado pero se puede solicitar
  if (!permission.granted) {
    return (
      <CameraPermission
        onRequestPermission={requestPermission}
      />
    );
  }

  // --- Cámara activa ---
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <CameraViewComponent
        cameraRef={cameraRef}
        facing={facing}
        onReady={() => setIsReady(true)}
      >
        {/* Aquí en la Capa 2 inyectaremos el overlay AR como hijo */}
      </CameraViewComponent>

      <CameraControls
        onFlip={toggleFacing}
        onCapture={takePicture}
        mode="ar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});