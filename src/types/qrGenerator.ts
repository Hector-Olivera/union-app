export type QRStyle = 'solid' | 'gradient';
// solid: color único, máxima compatibilidad de lectura
// gradient: degradado lineal del color elegido a una versión más clara

export type QRGeneratorConfig = {
  value: string;          // El contenido del QR (el scheme unionapp://...)
  color: string;          // Color principal del QR
  secondaryColor: string;  // Color final del degradado
  backgroundColor: string;
  style: QRStyle;
  size: number;           // Tamaño en px para el preview
  storeName: string;      // Nombre que aparece debajo del QR
  logoSize: number;       // Tamaño del logo Union App en el centro
};

// Colores predefinidos que el usuario puede elegir
export type QRColorOption = {
  id: string;
  label: string;
  color: string;
};

export const QR_COLOR_OPTIONS: QRColorOption[] = [
  { id: 'violet',   label: 'Violeta',    color: '#6C63FF' },
  { id: 'black',    label: 'Negro',      color: '#0a0a0a' },
  { id: 'fire',     label: 'Fuego',      color: '#FF6B35' },
  { id: 'ocean',    label: 'Oceano',     color: '#0077B6' },
  { id: 'forest',   label: 'Bosque',     color: '#2D6A4F' },
  { id: 'midnight', label: 'Medianoche', color: '#3A0CA3' },
];

// Config por defecto al abrir el generador
export const DEFAULT_QR_CONFIG: Omit<QRGeneratorConfig, 'value' | 'storeName'> = {
  color:           '#6C63FF',
  secondaryColor:  '#FF6584',
  backgroundColor: '#FFFFFF',
  style:           'solid',
  size:            220,
  logoSize:        44,
};