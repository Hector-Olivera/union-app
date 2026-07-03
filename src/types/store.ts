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
  businessHours?: BusinessHours;
  todos?: TodoItem[];
  announcements?: Announcement[];
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

// ── HORARIOS DE ATENCIÓN ──

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type DayHours = {
  open: string;   // formato "HH:mm", ej: "09:00"
  close: string;  // formato "HH:mm", ej: "18:00"
  closed: boolean; // true = cerrado ese día, ignora open/close
};

export type BusinessHours = Record<DayOfWeek, DayHours>;

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Lunes', tue: 'Martes', wed: 'Miércoles',
  thu: 'Jueves', fri: 'Viernes', sat: 'Sábado', sun: 'Domingo',
};

export const DAY_ORDER: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// Horario por defecto: lunes a viernes 9-18, fin de semana cerrado
export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  mon: { open: '09:00', close: '18:00', closed: false },
  tue: { open: '09:00', close: '18:00', closed: false },
  wed: { open: '09:00', close: '18:00', closed: false },
  thu: { open: '09:00', close: '18:00', closed: false },
  fri: { open: '09:00', close: '18:00', closed: false },
  sat: { open: '09:00', close: '13:00', closed: false },
  sun: { open: '09:00', close: '13:00', closed: true },
};

// ── PENDIENTES ──

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
};

// ── NOVEDADES ──

export type Announcement = {
  id: string;
  text: string;
  createdAt: string;
};