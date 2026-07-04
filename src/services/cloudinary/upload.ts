const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

// Endpoint de subida de Cloudinary — específico para imágenes
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Límite de tamaño que validamos nosotros mismos antes de subir,
// ya que el preset de Cloudinary no tiene esa restricción configurada.
const MAX_FILE_SIZE_MB = 5;

export type UploadResult = {
  url: string;      // URL pública final de la imagen
  publicId: string; // ID interno de Cloudinary, útil para borrar después
};

// Sube una imagen a Cloudinary desde su URI local (del picker).
// Funciona igual en web y en native porque FormData + fetch
// son estándares soportados en ambas plataformas.
export const uploadImageToCloudinary = async (
  localUri: string,
  folder: string = 'union-app'
): Promise<UploadResult> => {

  const formData = new FormData();

  // En React Native, adjuntar un archivo a FormData requiere este
  // formato específico de objeto (no es un File real como en web puro)
  formData.append('file', {
    uri: localUri,
    type: 'image/jpeg',
    name: `upload_${Date.now()}.jpg`,
  } as any);

  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
    headers: {
      // No seteamos Content-Type manualmente — fetch lo genera solo
      // con el boundary correcto cuando el body es FormData.
      // Si lo forzamos nosotros, la subida falla silenciosamente.
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || 'Error al subir la imagen');
  }

  const data = await response.json();

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