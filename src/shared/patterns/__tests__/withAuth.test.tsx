import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";

import { withAuth, withPermissions } from "../withAuth";

import { renderWithProviders } from "../../../test/renderWithProviders";
import { useAuthStore } from "../../../features/auth/store/authStore";

import type { AuthUser, UserRole } from "../../../features/auth/types/auth.types";

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

function Secret() {
  return <p>Zone réservée</p>;
}

describe("withAuth / withPermissions (HOC)", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it("withAuth renvoie vers la connexion sans session", () => {
    const Protege = withAuth(Secret);

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<p>Connexion</p>} />
        <Route path="/" element={<Protege />} />
      </Routes>,
    );

    expect(screen.getByText("Connexion")).toBeInTheDocument();
  });

  it("withAuth laisse passer un utilisateur connecté", () => {
    connecter("user");

    const Protege = withAuth(Secret);

    renderWithProviders(<Protege />);

    expect(screen.getByText("Zone réservée")).toBeInTheDocument();
  });

  it("withPermissions masque le composant pour un rôle non autorisé", () => {
    connecter("user");

    const Protege = withPermissions(Secret, ["admin"]);

    const { container } = renderWithProviders(<Protege />);

    expect(container).toBeEmptyDOMElement();
  });

  it("withPermissions affiche le composant pour un rôle autorisé", () => {
    connecter("admin");

    const Protege = withPermissions(Secret, ["admin", "ceo"]);

    renderWithProviders(<Protege />);

    expect(screen.getByText("Zone réservée")).toBeInTheDocument();
  });

  it("withPermissions rend le repli fourni", () => {
    connecter("user");

    const Protege = withPermissions(Secret, ["admin"], () => (
      <p>Accès refusé</p>
    ));

    renderWithProviders(<Protege />);

    expect(screen.getByText("Accès refusé")).toBeInTheDocument();
  });

  it("conserve un displayName lisible pour le débogage", () => {
    expect(withAuth(Secret).displayName).toBe("withAuth(Secret)");
    expect(withPermissions(Secret, ["admin"]).displayName).toBe(
      "withPermissions(Secret)",
    );
  });
});
