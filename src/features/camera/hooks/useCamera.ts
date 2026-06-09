import { useRef, useState, useCallback } from 'react';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';

// CameraType es 'front' | 'back'
// useCameraPermissions devuelve [permission, requestPermission]
// permission.granted: boolean — si el usuario ya dio permiso
// permission: null — mientras carga el estado del permiso

export const useCamera = () => {
  const cameraRef = useRef<CameraView>(null);
  // useRef para la cámara porque necesitamos llamar métodos imperativos
  // (takePictureAsync) sin causar re-renders

  const [facing, setFacing] = useState<CameraType>('back');
  // 'back' es la cámara trasera — el default para AR y QR

  const [isReady, setIsReady] = useState(false);
  // true cuando la cámara terminó de inicializarse
  // Evita llamar takePictureAsync antes de que esté lista

  const [permission, requestPermission] = useCameraPermissions();
  // Hook oficial de expo-camera para manejar permisos
  // Persiste la decisión del usuario entre sesiones

  const toggleFacing = useCallback(() => {
    setFacing(prev => prev === 'back' ? 'front' : 'back');
    // useCallback evita recrear esta función en cada render
    // Importante cuando se pasa como prop a componentes hijos
  }, []);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || !isReady) return null;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        // 0.8 = 80% de calidad JPEG — balance entre fidelidad y tamaño
        // Para AR no necesitamos calidad máxima
        skipProcessing: true,
        // skipProcessing: true es más rápido en Android
        // Evita el procesamiento de imagen nativo post-captura
      });
      return photo;
    } catch (error) {
      console.error('[useCamera] takePicture error:', error);
      return null;
    }
  }, [isReady]);

  return {
    cameraRef,
    facing,
    isReady,
    permission,
    setIsReady,
    toggleFacing,
    takePicture,
    requestPermission,
    // Exponemos solo lo necesario — encapsulación
    // El estado interno (useState) no se expone directamente
  };
};