import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Header from "../Header";

import { renderWithProviders } from "../../../test/renderWithProviders";
import { useAuthStore } from "../../../features/auth/store/authStore";

import type { AuthUser } from "../../../features/auth/types/auth.types";

const arthur: AuthUser = {
  id: "admin-arthur",
  username: "Arthur",
  password: "admin",
  role: "admin",
  employeeId: null,
};

describe("<Header />", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: arthur, isAuthenticated: true });
  });

  it("affiche l'utilisateur et son rôle traduit", () => {
    renderWithProviders(
      <Header isDarkTheme onToggleTheme={() => undefined} />,
    );

    expect(screen.getByText("Arthur")).toBeInTheDocument();
    expect(screen.getByText("Administrateur")).toBeInTheDocument();
  });

  it("propose de passer au thème clair quand le sombre est actif", () => {
    renderWithProviders(
      <Header isDarkTheme onToggleTheme={() => undefined} />,
    );

    expect(
      screen.getByRole("button", { name: "Activer le thème clair" }),
    ).toBeInTheDocument();
  });

  it("déclenche la bascule de thème au clic", async () => {
    const user = userEvent.setup();
    const onToggleTheme = vi.fn();

    renderWithProviders(
      <Header isDarkTheme={false} onToggleTheme={onToggleTheme} />,
    );

    await user.click(
      screen.getByRole("button", { name: "Activer le thème sombre" }),
    );

    expect(onToggleTheme).toHaveBeenCalledOnce();
  });

  it("ouvre le menu de profil et permet de se déconnecter", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Header isDarkTheme onToggleTheme={() => undefined} />,
    );

    const profil = screen.getByRole("button", { expanded: false });

    await user.click(profil);

    expect(profil).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("menuitem", { name: "Se déconnecter" }));

    expect(useAuthStore.getState().user).toBeNull();
  });
});
