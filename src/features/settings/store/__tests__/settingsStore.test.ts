import { beforeEach, describe, expect, it } from "vitest";

import { useSettingsStore } from "../settingsStore";

import { defaultSettings } from "../../types/settings.types";

describe("settingsStore", () => {
  beforeEach(() => {
    useSettingsStore.setState({ ...defaultSettings });
  });

  it("part des valeurs par défaut", () => {
    expect(useSettingsStore.getState().theme).toBe(defaultSettings.theme);
    expect(useSettingsStore.getState().accent).toBe("indigo");
  });

  it("applique une modification partielle sans toucher aux autres réglages", () => {
    useSettingsStore.getState().updateSettings({ accent: "emerald" });

    const state = useSettingsStore.getState();

    expect(state.accent).toBe("emerald");
    expect(state.density).toBe(defaultSettings.density);
    expect(state.landingPage).toBe(defaultSettings.landingPage);
  });

  it("cumule plusieurs modifications successives", () => {
    useSettingsStore.getState().updateSettings({ theme: "light" });
    useSettingsStore.getState().updateSettings({ collapsedSidebar: true });

    expect(useSettingsStore.getState().theme).toBe("light");
    expect(useSettingsStore.getState().collapsedSidebar).toBe(true);
  });

  it("revient à l'état d'origine après réinitialisation", () => {
    useSettingsStore.getState().updateSettings({
      theme: "light",
      accent: "rose",
      density: "compact",
      collapsedSidebar: true,
      landingPage: "/erp",
    });

    useSettingsStore.getState().resetSettings();

    const { updateSettings, resetSettings, ...state } =
      useSettingsStore.getState();

    expect(state).toEqual(defaultSettings);
    expect(typeof updateSettings).toBe("function");
    expect(typeof resetSettings).toBe("function");
  });
});
