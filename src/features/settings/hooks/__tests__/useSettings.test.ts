import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useSettings } from "../useSettings";
import { useSettingsStore } from "../../store/settingsStore";
import { defaultSettings } from "../../types/settings.types";

describe("useSettings", () => {
  beforeEach(() => {
    useSettingsStore.setState({ ...defaultSettings });
  });

  it("compose les classes de la coque à partir des préférences", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.shellClassName).toBe(
      "app-shell dark-theme accent-indigo density-comfortable",
    );
  });

  it("ajoute la classe du menu réduit quand l'option est active", () => {
    const { result } = renderHook(() => useSettings());

    act(() => result.current.setSetting("collapsedSidebar", true));

    expect(result.current.shellClassName).toContain("sidebar-collapsed");
  });

  it("retire la classe sombre en thème clair", () => {
    const { result } = renderHook(() => useSettings());

    act(() => result.current.setSetting("theme", "light"));

    expect(result.current.shellClassName).not.toContain("dark-theme");
    expect(result.current.isDarkTheme).toBe(false);
  });

  it("bascule le thème dans les deux sens", () => {
    const { result } = renderHook(() => useSettings());

    act(() => result.current.toggleTheme());
    expect(result.current.settings.theme).toBe("light");

    act(() => result.current.toggleTheme());
    expect(result.current.settings.theme).toBe("dark");
  });

  it("reflète le changement d'accent dans les classes", () => {
    const { result } = renderHook(() => useSettings());

    act(() => result.current.setSetting("accent", "rose"));

    expect(result.current.shellClassName).toContain("accent-rose");
  });
});
