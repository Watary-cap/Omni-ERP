import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "../authStore";

import type { AuthUser } from "../../types/auth.types";

const arthur: AuthUser = {
  id: "admin-arthur",
  username: "Arthur",
  password: "admin",
  role: "admin",
  employeeId: null,
};

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it("démarre déconnecté", () => {
    const { user, isAuthenticated } = useAuthStore.getState();

    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it("enregistre l'utilisateur à la connexion", () => {
    useAuthStore.getState().login(arthur);

    const { user, isAuthenticated } = useAuthStore.getState();

    expect(user).toEqual(arthur);
    expect(isAuthenticated).toBe(true);
  });

  it("vide la session à la déconnexion", () => {
    useAuthStore.getState().login(arthur);
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("met à jour le mot de passe sans écraser le reste de la session", () => {
    useAuthStore.getState().login(arthur);
    useAuthStore.getState().updateUser({ password: "nouveau" });

    const { user } = useAuthStore.getState();

    expect(user?.password).toBe("nouveau");
    expect(user?.username).toBe("Arthur");
    expect(user?.role).toBe("admin");
  });

  it("ignore la mise à jour quand personne n'est connecté", () => {
    useAuthStore.getState().updateUser({ password: "nouveau" });

    expect(useAuthStore.getState().user).toBeNull();
  });
});
