import { create } from 'zustand';

type Location = {
  latitude: number;
  longitude: number;
};

type PlayerState = {
  location: Location | null;
  nearbyPlayers: Player[];
  setLocation: (location: Location) => void;
  setNearbyPlayers: (players: Player[]) => void;
};

export type Player = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  location: Location;
  armor?: string; // estética equipada
};

export const usePlayerStore = create<PlayerState>((set) => ({
  location: null,
  nearbyPlayers: [],
  setLocation: (location) => set({ location }),
  setNearbyPlayers: (players) => set({ nearbyPlayers: players }),
}));