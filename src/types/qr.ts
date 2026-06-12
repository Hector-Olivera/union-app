// El contenido de un QR en la plataforma Union App sigue un formato propio.
// Esto nos permite distinguir QRs del ecosistema de QRs externos (URLs, texto).

export type QRContentType =
  | 'object_3d'      // Renderizar un objeto 3D en AR
  | 'location'       // Lugar virtual con estética propia
  | 'profile'        // Perfil de otro usuario
  | 'store_item'     // Item de la tienda
  | 'external_url'   // URL externa — tratamos con cuidado
  | 'unknown';       // QR no reconocido por el ecosistema

export type QRPayload = {
  type: QRContentType;
  id: string;         // ID del recurso en Firestore
  data?: Record<string, any>; // Datos adicionales opcionales
};

export type QRScanResult = {
  raw: string;           // Contenido crudo del QR
  payload: QRPayload;    // Contenido interpretado
  scannedAt: Date;
};