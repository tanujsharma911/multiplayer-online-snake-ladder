import { create } from "zustand";

interface stateType {
  isLoggedIn: boolean;
  id: string | undefined;
  email: string | undefined;
  displayName: string | undefined;
  avatar: string | undefined;
}

interface storeType {
  user: stateType;
  login: (user: stateType) => void;
  logout: () => void;
}

const defaultState = {
  isLoggedIn: false,
  id: undefined,
  email: undefined,
  displayName: undefined,
  avatar: undefined,
};

export const useUser = create<storeType>((set) => ({
  user: defaultState,
  login: (user: stateType) => set({ user: { ...user, isLoggedIn: true } }),
  logout: () => set({ user: { ...defaultState, isLoggedIn: false } }),
}));
