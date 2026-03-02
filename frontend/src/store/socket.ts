import type { Socket } from "socket.io-client";
import { create } from "zustand";

interface storeType {
  socket: Socket | null;
  connect: (payload: Socket) => void;
  disconnect: () => void;
}

export const useSocketStore = create<storeType>((set) => ({
  socket: null,
  connect: (payload: Socket) => set({ socket: payload }),
  disconnect: () => set({ socket: null }),
}));
