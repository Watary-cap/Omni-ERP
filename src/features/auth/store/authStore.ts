import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthUser } from "../types/auth.types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;

  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const storageKey = "omni-erp-auth";

/**
 * Avant Zustand, la session était écrite à plat : { user, isAuthenticated }.
 * `persist` attend une enveloppe { state, version } : on lit les deux formes
 * pour qu'une session déjà ouverte ne soit pas perdue.
 */
const storage = createJSONStorage(() => ({
  getItem: (name: string) => {
    const raw = window.localStorage.getItem(name);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed === "object" && "state" in parsed) {
        return raw;
      }

      return JSON.stringify({ state: parsed, version: 1 });
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) =>
    window.localStorage.setItem(name, value),
  removeItem: (name: string) => window.localStorage.removeItem(name),
}));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (patch) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...patch } } : state,
        ),
    }),
    {
      name: storageKey,
      version: 1,
      storage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
