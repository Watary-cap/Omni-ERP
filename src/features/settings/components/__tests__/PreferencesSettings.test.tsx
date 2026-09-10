import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PreferencesSettings from "../PreferencesSettings";

import { renderWithProviders } from "../../../../test/renderWithProviders";
import { useSettingsStore } from "../../store/settingsStore";
import { defaultSettings } from "../../types/settings.types";

describe("<PreferencesSettings />", () => {
  beforeEach(() => {
    useSettingsStore.setState({ ...defaultSettings });
  });

  it("change la page d'accueil", async () => {
    const user = userEvent.setup();

    renderWithProviders(<PreferencesSettings />);

    await user.selectOptions(
      screen.getByLabelText("Page d'accueil après connexion"),
      "/erp",
    );

    expect(useSettingsStore.getState().landingPage).toBe("/erp");
  });

  it("demande une confirmation avant de réinitialiser", async () => {
    const user = userEvent.setup();

    useSettingsStore.setState({ accent: "rose" });

    renderWithProviders(<PreferencesSettings />);

    await user.click(screen.getByRole("button", { name: "Réinitialiser" }));

    expect(screen.getByRole("button", { name: "Confirmer" })).toBeInTheDocument();
    // Rien n'a changé tant que la confirmation n'est pas donnée
    expect(useSettingsStore.getState().accent).toBe("rose");
  });

  it("annule sans rien modifier", async () => {
    const user = userEvent.setup();

    useSettingsStore.setState({ accent: "rose" });

    renderWithProviders(<PreferencesSettings />);

    await user.click(screen.getByRole("button", { name: "Réinitialiser" }));
    await user.click(screen.getByRole("button", { name: "Annuler" }));

    expect(useSettingsStore.getState().accent).toBe("rose");
    expect(screen.queryByRole("button", { name: "Confirmer" })).toBeNull();
  });

  it("restaure les valeurs par défaut après confirmation", async () => {
    const user = userEvent.setup();

    useSettingsStore.setState({
      accent: "rose",
      density: "compact",
      landingPage: "/erp",
    });

    renderWithProviders(<PreferencesSettings />);

    await user.click(screen.getByRole("button", { name: "Réinitialiser" }));
    await user.click(screen.getByRole("button", { name: "Confirmer" }));

    const { updateSettings, resetSettings, ...state } =
      useSettingsStore.getState();

    expect(state).toEqual(defaultSettings);
    expect(updateSettings).toBeTypeOf("function");
    expect(resetSettings).toBeTypeOf("function");
  });
});
