import { useSyncExternalStore } from "react";

import type { AuthUser } from "../types/auth.types";

interface AuthState {
  user: AuthUser | null;

  isAuthenticated: boolean;

  login: (user: AuthUser) => void;

  logout: () => void;
}

type AuthData = Pick<AuthState, "user" | "isAuthenticated">;

const storageKey = "omni-erp-auth";

const getInitialState = (): AuthData => {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false };
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : { user: null, isAuthenticated: false };
  } catch {
    return { user: null, isAuthenticated: false };
  }
};

let state = getInitialState();
const listeners = new Set<() => void>();

const login = (user: AuthUser) => {
  updateState({ user, isAuthenticated: true });
};

const logout = () => {
  updateState({ user: null, isAuthenticated: false });
};

let snapshot: AuthState = { ...state, login, logout };
const serverSnapshot: AuthState = {
  user: null,
  isAuthenticated: false,
  login: () => undefined,
  logout: () => undefined,
};

const updateState = (next: AuthData) => {
  state = next;
  snapshot = { ...state, login, logout };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }
  listeners.forEach((listener) => listener());
};

export const useAuthStore = (): AuthState =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => snapshot,
    () => serverSnapshot,
  );
