import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "../ProtectedRoute";

import { renderWithProviders } from "../../../../test/renderWithProviders";
import { useAuthStore } from "../../store/authStore";

import type { AuthUser, UserRole } from "../../types/auth.types";

function connecter(role: UserRole) {
  const user: AuthUser = {
    id: "compte",
    username: "Compte",
    password: "x",
    role,
    employeeId: null,
  };

  useAuthStore.setState({ user, isAuthenticated: true });
}

function arbre(allowedRoles?: UserRole[]) {
  return (
    <Routes>
      <Route path="/login" element={<p>Écran de connexion</p>} />
      <Route path="/dashboard" element={<p>Tableau de bord</p>} />

      <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
        <Route path="/prive" element={<p>Contenu protégé</p>} />
      </Route>
    </Routes>
  );
}

describe("<ProtectedRoute />", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it("renvoie vers la connexion quand la session est vide", () => {
    renderWithProviders(arbre(), { route: "/prive" });

    expect(screen.getByText("Écran de connexion")).toBeInTheDocument();
  });

  it("laisse passer un utilisateur connecté", () => {
    connecter("user");

    renderWithProviders(arbre(), { route: "/prive" });

    expect(screen.getByText("Contenu protégé")).toBeInTheDocument();
  });

  it("laisse passer un rôle autorisé", () => {
    connecter("admin");

    renderWithProviders(arbre(["admin", "ceo"]), { route: "/prive" });

    expect(screen.getByText("Contenu protégé")).toBeInTheDocument();
  });

  it("renvoie un rôle non autorisé vers le tableau de bord, pas vers la connexion", () => {
    connecter("user");

    renderWithProviders(arbre(["admin"]), { route: "/prive" });

    expect(screen.getByText("Tableau de bord")).toBeInTheDocument();
    expect(screen.queryByText("Écran de connexion")).toBeNull();
  });
});
