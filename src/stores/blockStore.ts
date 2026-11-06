import { create } from 'zustand';
import { blockUser, unblockUser, subscribeToBlocks } from '@services/firebase/safety';
import type { BlockedUser } from '@/types/safety';

type BlockState = {
  blocked: BlockedUser[];
  blockedIds: string[];
  userId: string | null;
  startBlocksListener: (userId: string) => () => void;
  clearBlocks: () => void;
  block: (target: { id: string; name: string; avatarUrl?: string }) => Promise<void>;
  unblock: (blockedId: string) => Promise<void>;
};

export const useBlockStore = create<BlockState>((set, get) => ({
  blocked: [],
  blockedIds: [],
  userId: null,

  startBlocksListener: (userId) => {
    set({ userId });
    return subscribeToBlocks(userId, (list) =>
      set({ blocked: list, blockedIds: list.map(b => b.blockedId) })
    );
  },

  clearBlocks: () => set({ blocked: [], blockedIds: [], userId: null }),

  block: async (target) => {
    const { userId } = get();
    if (userId) await blockUser(userId, target);
  },

  unblock: async (blockedId) => {
    const { userId } = get();
    if (userId) await unblockUser(userId, blockedId);
  },
}));