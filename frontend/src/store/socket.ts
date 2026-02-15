import { create } from "zustand";

interface storeType {
  socket: WebSocket | null;
  connect: (payload: WebSocket) => void;
  disconnect: () => void;
}

export const useSocketStore = create<storeType>((set) => ({
  socket: null,
  connect: (payload: WebSocket) => set({ socket: payload }),
  disconnect: () => set({ socket: null }),
}));
