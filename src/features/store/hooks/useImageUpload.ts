import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary, validateImageSize } from '@services/cloudinary/upload';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Abre la galería del dispositivo, permite recortar la imagen
  // en el aspecto indicado, y sube el resultado a Cloudinary.
  // aspectRatio: [ancho, alto] — ej [1,1] para logo cuadrado, [16,9] para banner
  const pickAndUpload = async (
    folder: string,
    aspectRatio: [number, number] = [1, 1]
  ): Promise<string | null> => {
    setError(null);

    // Pedimos permiso de galería — en iOS/Android es obligatorio
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Necesitamos acceso a tus fotos para continuar');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      // allowsEditing habilita el recorte nativo del sistema,
      // con el aspecto forzado que le pasamos
      aspect: aspectRatio,
      quality: 0.8,
      // quality 0.8 reduce el peso del archivo sin pérdida visible notable
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    const asset = result.assets[0];

    // Validamos tamaño si el picker nos dio esa información
    if (asset.fileSize && !validateImageSize(asset.fileSize)) {
      setError('La imagen es muy pesada. Máximo 5MB.');
      return null;
    }

    try {
      setUploading(true);
      const { url } = await uploadImageToCloudinary(asset.uri, folder);
      return url;
    } catch (e: any) {
      setError(e.message || 'Error al subir la imagen');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { pickAndUpload, uploading, error, clearError: () => setError(null) };
};