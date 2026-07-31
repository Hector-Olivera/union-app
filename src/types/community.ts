export type FavoriteStore = {
  storeId: string;
  addedAt: string;
};

export type RecentVisit = {
  storeId: string;
  visitedAt: string;
};

// Vista resumida de una tienda para listas de comunidad —
// no necesitamos el objeto Store completo, solo lo mínimo para mostrar
export type StoreSummary = {
  id: string;
  name: string;
  logoUrl?: string;
  themeId: string;
  hasNewAnnouncement?: boolean;
};