import { beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import LoginForm from "../LoginForm";

import { renderWithProviders } from "../../../../test/renderWithProviders";
import { server } from "../../../../test/msw/server";
import { useAuthStore } from "../../store/authStore";
import { useSettingsStore } from "../../../settings/store/settingsStore";
import { defaultSettings } from "../../../settings/types/settings.types";

describe("<LoginForm />", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
    useSettingsStore.setState({ ...defaultSettings });
  });

  it("connecte un utilisateur avec des identifiants valides", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText("Identifiant"), "Arthur");
    await user.type(screen.getByLabelText("Mot de passe"), "admin");
    await user.click(screen.getByRole("button", { name: /Se connecter/ }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    expect(useAuthStore.getState().user?.username).toBe("Arthur");
  });

  it("affiche une erreur sur des identifiants inconnus", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText("Identifiant"), "Inconnu");
    await user.type(screen.getByLabelText("Mot de passe"), "xxx");
    await user.click(screen.getByRole("button", { name: /Se connecter/ }));

    expect(
      await screen.findByText("Identifiant ou mot de passe incorrect."),
    ).toBeInTheDocument();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("signale une panne du serveur sans révéler l'erreur technique", async () => {
    const user = userEvent.setup();

    server.use(
      http.get("http://localhost:3000/users", () =>
        HttpResponse.json({ message: "boom" }, { status: 500 }),
      ),
    );

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText("Identifiant"), "Arthur");
    await user.type(screen.getByLabelText("Mot de passe"), "admin");
    await user.click(screen.getByRole("button", { name: /Se connecter/ }));

    expect(await screen.findByText(/Impossible de contacter/)).toBeInTheDocument();
  });

  it("permet d'afficher puis de masquer le mot de passe", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);

    const champ = screen.getByLabelText("Mot de passe");

    expect(champ).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: "Afficher le mot de passe" }),
    );

    expect(champ).toHaveAttribute("type", "text");

    await user.click(
      screen.getByRole("button", { name: "Masquer le mot de passe" }),
    );

    expect(champ).toHaveAttribute("type", "password");
  });
});
