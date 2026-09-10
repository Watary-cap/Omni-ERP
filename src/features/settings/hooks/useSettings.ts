import { useCallback, useMemo } from "react";

import { useSettingsStore } from "../store/settingsStore";

import type { AppSettings } from "../types/settings.types";

export function useSettings() {
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const resetSettings = useSettingsStore((state) => state.resetSettings);

  const theme = useSettingsStore((state) => state.theme);
  const accent = useSettingsStore((state) => state.accent);
  const density = useSettingsStore((state) => state.density);
  const collapsedSidebar = useSettingsStore((state) => state.collapsedSidebar);
  const landingPage = useSettingsStore((state) => state.landingPage);
  const alerts = useSettingsStore((state) => state.alerts);

  const settings = useMemo<AppSettings>(
    () => ({ theme, accent, density, collapsedSidebar, landingPage, alerts }),
    [theme, accent, density, collapsedSidebar, landingPage, alerts],
  );

  /* Classes appliquées sur la coque de l'application : c'est ce qui
     rend les préférences visibles à l'écran. */
  const shellClassName = useMemo(
    () =>
      [
        "app-shell",
        theme === "dark" ? "dark-theme" : "",
        `accent-${accent}`,
        `density-${density}`,
        collapsedSidebar ? "sidebar-collapsed" : "",
      ]
        .filter(Boolean)
        .join(" "),
    [theme, accent, density, collapsedSidebar],
  );

  /* Références stables : les composants qui reçoivent ces fonctions en
     prop peuvent être mémoïsés sans être invalidés à chaque rendu. */
  const toggleTheme = useCallback(() => {
    updateSettings({ theme: theme === "dark" ? "light" : "dark" });
  }, [theme, updateSettings]);

  const setSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      updateSettings({ [key]: value } as Partial<AppSettings>);
    },
    [updateSettings],
  );

  return {
    settings,
    shellClassName,
    isDarkTheme: theme === "dark",
    setSetting,
    updateSettings,
    resetSettings,
    toggleTheme,
  };
}
