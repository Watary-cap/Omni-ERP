import { beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProfileSettings from "../ProfileSettings";

import { renderWithProviders } from "../../../../test/renderWithProviders";
import { useAuthStore } from "../../../auth/store/authStore";

import type { AuthUser } from "../../../auth/types/auth.types";

const julie: AuthUser = {
  id: "user-julie",
  username: "Julie",
  password: "user",
  role: "user",
  employeeId: "4",
};

function connecter(user: AuthUser = julie) {
  useAuthStore.setState({ user, isAuthenticated: true });
}

describe("<ProfileSettings />", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it("ne rend rien quand personne n'est connecté", () => {
    const { container } = renderWithProviders(<ProfileSettings />);

    expect(container).toBeEmptyDOMElement();
  });

  it("affiche l'identité et le rôle traduit", () => {
    connecter();

    renderWithProviders(<ProfileSettings />);

    expect(screen.getAllByText("Julie").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Salarié").length).toBeGreaterThan(0);
  });

  it("rattache la fiche RH de l'employé lié", async () => {
    connecter();

    renderWithProviders(<ProfileSettings />);

    // La fiche arrive de l'API : on attend son affichage
    expect(await screen.findByText("Julie Robert")).toBeInTheDocument();
    expect(screen.getByText("Developpeuse Frontend")).toBeInTheDocument();
  });

  it("refuse un mot de passe actuel erroné", async () => {
    const user = userEvent.setup();

    connecter();

    renderWithProviders(<ProfileSettings />);

    await user.type(screen.getByLabelText("Mot de passe actuel"), "faux");
    await user.type(screen.getByLabelText("Nouveau mot de passe"), "abcd1234");
    await user.type(screen.getByLabelText("Confirmation"), "abcd1234");
    await user.click(screen.getByRole("button", { name: "Mettre à jour" }));

    expect(
      await screen.findByText("Le mot de passe actuel est incorrect."),
    ).toBeInTheDocument();
  });

  it("refuse une confirmation qui ne correspond pas", async () => {
    const user = userEvent.setup();

    connecter();

    renderWithProviders(<ProfileSettings />);

    await user.type(screen.getByLabelText("Mot de passe actuel"), "user");
    await user.type(screen.getByLabelText("Nouveau mot de passe"), "abcd1234");
    await user.type(screen.getByLabelText("Confirmation"), "different");
    await user.click(screen.getByRole("button", { name: "Mettre à jour" }));

    expect(
      await screen.findByText(
        "La confirmation ne correspond pas au nouveau mot de passe.",
      ),
    ).toBeInTheDocument();
  });

  it("refuse un mot de passe trop court", async () => {
    const user = userEvent.setup();

    connecter();

    renderWithProviders(<ProfileSettings />);

    await user.type(screen.getByLabelText("Mot de passe actuel"), "user");
    await user.type(screen.getByLabelText("Nouveau mot de passe"), "ab");
    await user.type(screen.getByLabelText("Confirmation"), "ab");
    await user.click(screen.getByRole("button", { name: "Mettre à jour" }));

    expect(
      await screen.findByText(
        "Le nouveau mot de passe doit faire au moins 4 caractères.",
      ),
    ).toBeInTheDocument();
  });

  it("met à jour le mot de passe et resynchronise la session", async () => {
    const user = userEvent.setup();

    connecter();

    renderWithProviders(<ProfileSettings />);

    await user.type(screen.getByLabelText("Mot de passe actuel"), "user");
    await user.type(screen.getByLabelText("Nouveau mot de passe"), "abcd1234");
    await user.type(screen.getByLabelText("Confirmation"), "abcd1234");
    await user.click(screen.getByRole("button", { name: "Mettre à jour" }));

    expect(
      await screen.findByText(
        "Mot de passe mis à jour. Il sera demandé à la prochaine connexion.",
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(useAuthStore.getState().user?.password).toBe("abcd1234");
    });

    // Les champs sont vidés après succès
    expect(screen.getByLabelText("Mot de passe actuel")).toHaveValue("");
  });
});
