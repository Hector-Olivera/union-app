// Configuración central de la aplicación.
// Al crear una nueva app del ecosistema, se modifica este archivo
// para personalizar nombre, descripción, módulos habilitados y acciones del Home.
// El resto del código no cambia.

export type AppModule = 'camera' | 'store' | 'explore' | 'messaging' | 'qr';

export type QuickAction = {
  id: string;
  label: string;
  description: string;
  route: string;
  module: AppModule;
  // color y accentColor permiten personalizar cada acción visualmente
};

export type AppConfig = {
  appName: string;
  appTagline: string;
  enabledModules: AppModule[];
  homeQuickActions: QuickAction[];
};

// Configuración de Union App base
// Para crear una nueva app, se crea un nuevo objeto AppConfig
// y se importa acá o se selecciona dinámicamente
export const CURRENT_APP_CONFIG: AppConfig = {
  appName: 'Union App',
  appTagline: 'Tu universo aumentado',
  enabledModules: ['camera', 'store', 'explore', 'qr'],
  homeQuickActions: [
    {
      id: 'ar_camera',
      label: 'Cámara AR',
      description: 'Explorá el mundo aumentado',
      route: '/(app)/camera',
      module: 'camera',
    },
    {
      id: 'qr_scan',
      label: 'Escanear QR',
      description: 'Descubrí contenido digital',
      route: '/(app)/camera',
      module: 'qr',
    },
    {
      id: 'store',
      label: 'Tienda',
      description: 'Productos y servicios',
      route: '/(app)/store',
      module: 'store',
    },
  ],
};