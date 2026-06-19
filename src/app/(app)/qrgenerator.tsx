import { QRGenerator } from '@features/qr/components/QRGenerator';

// Ruta dedicada al generador de QR.
// Accesible desde el botón "Ver QR" del StoreDashboard.
// En el futuro también desde el perfil y otras secciones
// que necesiten generar QRs del ecosistema.
export default function QRGeneratorScreen() {
  return <QRGenerator />;
}