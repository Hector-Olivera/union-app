// Re-exporta todos los tipos desde un solo punto de entrada
// En lugar de importar desde cada store por separado,
// importás desde '@types' y tenés todo disponible
export type { User } from '@stores/authStore';
export type { Player } from '@stores/playerStore';

export type ARObject = {
  id: string;
  type: 'item' | 'npc' | 'portal' | 'decoration';
  modelUrl: string;
  position: { x: number; y: number; z: number };
  linkedQRCode?: string;
};

export type GameLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'shop' | 'exchange' | 'arena' | 'landmark';
  arTheme?: string;
};