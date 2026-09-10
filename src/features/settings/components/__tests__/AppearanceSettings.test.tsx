import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AppearanceSettings from "../AppearanceSettings";

import { renderWithProviders } from "../../../../test/renderWithProviders";
import { useSettingsStore } from "../../store/settingsStore";
import { defaultSettings } from "../../types/settings.types";

describe("<AppearanceSettings />", () => {
  beforeEach(() => {
    useSettingsStore.setState({ ...defaultSettings });
  });

  it("affiche les quatre réglages d'apparence", () => {
    renderWithProviders(<AppearanceSettings />);

    expect(screen.getByText("Thème")).toBeInTheDocument();
    expect(screen.getByText("Couleur d'accent")).toBeInTheDocument();
    expect(screen.getByText("Densité d'affichage")).toBeInTheDocument();
    expect(screen.getByText("Menu latéral réduit")).toBeInTheDocument();
  });

  it("marque le thème actif via aria-pressed", () => {
    renderWithProviders(<AppearanceSettings />);

    expect(screen.getByRole("button", { name: /Sombre/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /Clair/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("bascule en thème clair au clic", async () => {
    const user = userEvent.setup();

    renderWithProviders(<AppearanceSettings />);

    await user.click(screen.getByRole("button", { name: /Clair/ }));

    expect(useSettingsStore.getState().theme).toBe("light");
  });

  it("change la couleur d'accent au clic sur une pastille", async () => {
    const user = userEvent.setup();

    renderWithProviders(<AppearanceSettings />);

    await user.click(screen.getByRole("button", { name: "Émeraude" }));

    expect(useSettingsStore.getState().accent).toBe("emerald");
  });

  it("expose le menu réduit comme un interrupteur accessible", async () => {
    const user = userEvent.setup();

    renderWithProviders(<AppearanceSettings />);

    const interrupteur = screen.getByRole("switch");

    expect(interrupteur).toHaveAttribute("aria-checked", "false");

    await user.click(interrupteur);

    expect(useSettingsStore.getState().collapsedSidebar).toBe(true);
    expect(interrupteur).toHaveAttribute("aria-checked", "true");
  });

  it("passe en densité compacte", async () => {
    const user = userEvent.setup();

    renderWithProviders(<AppearanceSettings />);

    await user.click(screen.getByRole("button", { name: "Compact" }));

    expect(useSettingsStore.getState().density).toBe("compact");
  });
});
