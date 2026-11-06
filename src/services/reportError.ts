import { captureError } from '@services/monitoring';

// Códigos de Firestore que forman parte del funcionamiento normal y no son bugs:
// permiso denegado (reglas, bloqueos), sin conexión y listeners cancelados
const EXPECTED_CODES = ['permission-denied', 'unavailable', 'cancelled'];

export const reportError = (error: any, context: string) => {
  if (EXPECTED_CODES.includes(error?.code)) return;
  captureError(error, context);
};