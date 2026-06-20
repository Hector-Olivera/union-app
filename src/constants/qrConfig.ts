import { Colors } from './theme';

// Configuración centralizada del sistema QR.
// Usada por QRResultOverlay y cualquier otro módulo que procese QRs.
// Al agregar un nuevo tipo de QR, solo se edita este archivo.
export const QR_CONFIG = {
  store: {
    label: 'TIENDA',
    color: Colors.brand.primary,
    description: (id: string) => `Tienda: ${id}`,
    actionLabel: 'Ir a la tienda',
  },
  object_3d: {
    label: 'OBJETO 3D',
    color: Colors.brand.accent,
    description: (id: string) => `Objeto: ${id}`,
    actionLabel: 'Ver en AR',
  },
  location: {
    label: 'LUGAR VIRTUAL',
    color: Colors.brand.primary,
    description: (id: string) => `Lugar: ${id}`,
    actionLabel: 'Explorar lugar',
  },
  profile: {
    label: 'JUGADOR',
    color: Colors.brand.secondary,
    description: (id: string) => `Usuario: ${id}`,
    actionLabel: 'Ver perfil',
  },
  store_item: {
    label: 'ITEM DE TIENDA',
    color: Colors.status.success,
    description: (id: string) => `Item: ${id}`,
    actionLabel: 'Ver en tienda',
  },
  external_url: {
    label: 'ENLACE EXTERNO',
    color: Colors.status.warning,
    description: (id: string) => id.slice(0, 40) + (id.length > 40 ? '...' : ''),
    actionLabel: 'Abrir enlace',
  },
  unknown: {
    label: 'QR NO RECONOCIDO',
    color: Colors.dark.icon,
    description: (_id: string) => 'Este QR no pertenece al ecosistema Union App',
    actionLabel: '',
  },
} as const;