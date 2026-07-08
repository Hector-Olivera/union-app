import { Platform } from 'react-native';

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

// Endpoint de subida de Cloudinary — específico para imágenes
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Límite de tamaño que validamos nosotros mismos antes de subir,
// ya que el preset de Cloudinary no tiene esa restricción configurada.
const MAX_FILE_SIZE_MB = 5;

export type UploadResult = {
  url: string;      // URL pública final de la imagen
  publicId: string; // ID interno de Cloudinary
};

// Sube una imagen a Cloudinary desde su URI local (del picker).
export const uploadImageToCloudinary = async (
  localUri: string,
  folder: string = 'union-app'
): Promise<UploadResult> => {

  const formData = new FormData();


  if (Platform.OS === 'web') {
    // En web, localUri es un blob: URL. Necesitamos convertirlo
    // a un Blob real con fetch antes de adjuntarlo — FormData en
    // el navegador espera un objeto File/Blob, no un string de uri.
    const response = await fetch(localUri);
    const blob = await response.blob();
    formData.append('file', blob, `upload_${Date.now()}.jpg`);
  } else {
    // En React Native nativo, este formato de objeto es el correcto
    formData.append('file', {
      uri: localUri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    } as any);
  }

  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const uploadResponse = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errorData = await uploadResponse.json().catch(() => null);
    throw new Error(errorData?.error?.message || 'Error al subir la imagen');
  }

  const data = await uploadResponse.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};

// Valida el tamaño del archivo antes de intentar subirlo.
// Recibe el tamaño en bytes (lo obtenemos del picker) y lo compara
// contra el límite. Evita gastar cuota subiendo archivos que vamos
// a rechazar de todas formas.
export const validateImageSize = (sizeInBytes: number): boolean => {
  const sizeMB = sizeInBytes / (1024 * 1024);
  return sizeMB <= MAX_FILE_SIZE_MB;
};