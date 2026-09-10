import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import RolesSettings from "../RolesSettings";

import { renderWithProviders } from "../../../../test/renderWithProviders";
import { useAuthStore } from "../../../auth/store/authStore";

import type { AuthUser, UserRole } from "../../../auth/types/auth.types";

function connecter(role: UserRole) {
  const user: AuthUser = {
    id: `compte-${role}`,
    username: "Compte",
    password: "x",
    role,
    employeeId: null,
  };

  useAuthStore.setState({ user, isAuthenticated: true });
}

describe("<RolesSettings />", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it.each<UserRole>(["admin", "super_manager", "ceo"])(
    "affiche la matrice pour le rôle %s",
    (role) => {
      connecter(role);

      renderWithProviders(<RolesSettings />);

      expect(screen.getByText("Rôles et accès")).toBeInTheDocument();
      expect(screen.getByRole("table")).toBeInTheDocument();
    },
  );

  it.each<UserRole>(["manager", "user"])(
    "masque la matrice pour le rôle %s",
    (role) => {
      connecter(role);

      const { container } = renderWithProviders(<RolesSettings />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it("liste une colonne par rôle et une ligne par capacité", () => {
    connecter("admin");

    renderWithProviders(<RolesSettings />);

    // 5 rôles + la colonne de libellé
    expect(screen.getAllByRole("columnheader")).toHaveLength(6);
    expect(screen.getAllByRole("row")).toHaveLength(7); // en-tête + 6 capacités
  });

  it("signale les capacités autorisées et refusées", () => {
    connecter("admin");

    renderWithProviders(<RolesSettings />);

    expect(screen.getAllByLabelText("autorisé").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("non autorisé").length).toBeGreaterThan(0);
  });
});
