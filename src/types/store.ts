export type StoreSectionType =
  | 'logo'
  | 'banner'
  | 'carousel'
  | 'product_grid'
  | 'about'
  | 'contact';

export type StoreSection = {
  id: string;
  type: StoreSectionType;
  visible: boolean;
  order: number;
  // En el futuro: config específica de cada sección
};

export type Store = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  themeId: string;
  logoUrl?: string;
  bannerUrl?: string;
  createdAt: string;
  isPublic: boolean;
  layout: StoreSection[];
};

// Layout por defecto cuando el usuario activa su tienda.
// Tiene todas las secciones, algunas ocultas inicialmente.
// El usuario puede mostrarlas, ocultarlas y reordenarlas.
export const DEFAULT_STORE_LAYOUT: StoreSection[] = [
  { id: 'logo',         type: 'logo',         visible: true,  order: 0 },
  { id: 'banner',       type: 'banner',       visible: true,  order: 1 },
  { id: 'product_grid', type: 'product_grid', visible: true,  order: 2 },
  { id: 'carousel',     type: 'carousel',     visible: false, order: 3 },
  { id: 'about',        type: 'about',        visible: false, order: 4 },
  { id: 'contact',      type: 'contact',      visible: false, order: 5 },
];

// Labels en español para cada tipo de sección
export const SECTION_LABELS: Record<StoreSectionType, string> = {
  logo:         'Logo',
  banner:       'Banner',
  carousel:     'Carrusel de imágenes',
  product_grid: 'Grilla de productos',
  about:        'Acerca de',
  contact:      'Contacto',
};