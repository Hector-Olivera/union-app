export type FavoriteStore = {
  storeId: string;
  addedAt: string;
};

export type RecentVisit = {
  storeId: string;
  visitedAt: string;
};

export type StoreSummary = {
  id: string;
  name: string;
  logoUrl?: string;
  themeId: string;
  hasAnnouncement?: boolean;
  isAnnouncementUnseen?: boolean;
  latestAnnouncementText?: string;
};