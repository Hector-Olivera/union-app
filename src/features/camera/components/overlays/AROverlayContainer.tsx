import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
// Dimensions nos da el tamaño real de la pantalla del dispositivo.
// Lo necesitamos para posicionar elementos en coordenadas absolutas
// sobre la imagen de la cámara.

type Props = {
  children: React.ReactNode;
};

// Contenedor base para todos los overlays AR.
// Se renderiza encima de la cámara con position: absolute.
// Cualquier overlay que creemos vive dentro de este contenedor.
export const AROverlayContainer = ({ children }: Props) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* pointerEvents="box-none" permite que los toques pasen
          a través del contenedor pero sigan funcionando en los hijos.
          Sin esto, el overlay bloquearía los controles de la cámara. */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    // Ocupa toda la pantalla encima de la cámara
  },
});