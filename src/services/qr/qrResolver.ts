import type { QRPayload, QRContentType } from '@/types/qr';

// Prefijo que identifica QRs del ecosistema Emprenda ya.
// Un QR propio tiene este formato: emprendaya://type/id
// Ejemplo: emprendaya://object_3d/sword_legendary_001
const UNION_APP_SCHEME = 'emprendaya://';

// Interpreta el contenido crudo de un QR y devuelve un payload tipado.
// Es el punto de entrada único para procesar cualquier QR escaneado.
export const resolveQRContent = (rawContent: string): QRPayload => {

  // QR del ecosistema Emprenda ya
  if (rawContent.startsWith(UNION_APP_SCHEME)) {
    return parseUnionAppQR(rawContent);
  }

  // URL externa — puede ser cualquier sitio web
  if (rawContent.startsWith('http://') || rawContent.startsWith('https://')) {
    return {
      type: 'external_url',
      id: rawContent,
      data: { url: rawContent },
    };
  }

  // Contenido no reconocido
  return {
    type: 'unknown',
    id: '',
    data: { raw: rawContent },
  };
};

const parseUnionAppQR = (content: string): QRPayload => {
  // Eliminamos el scheme y separamos type/id
  // Input:  "emprendaya://object_3d/sword_legendary_001"
  // Result: type = "object_3d", id = "sword_legendary_001"
  const path = content.replace(UNION_APP_SCHEME, '');
  const [type, id, ...rest] = path.split('/');

  const validTypes: QRContentType[] = [
    'object_3d', 'location', 'profile', 'store', 'store_item'
  ];

  const resolvedType: QRContentType = validTypes.includes(type as QRContentType)
    ? (type as QRContentType)
    : 'unknown';

  return {
    type: resolvedType,
    id: id || '',
    data: rest.length > 0 ? { extra: rest.join('/') } : undefined,
  };
};