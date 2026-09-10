import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { defaultSettings, type AppSettings } from "../types/settings.types";

interface SettingsState extends AppSettings {
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const storageKey = "omni-erp-settings";

/* Clé utilisée avant la page Paramètres, conservée pour le thème. */
const legacyThemeKey = "omni-erp-theme";

const storage = createJSONStorage(() => ({
  getItem: (name: string) => {
    const raw = window.localStorage.getItem(name);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        // Préférences enregistrées à plat avant le passage à Zustand
        if (parsed && typeof parsed === "object" && !("state" in parsed)) {
          return JSON.stringify({ state: parsed, version: 1 });
        }

        return raw;
      } catch {
        return null;
      }
    }

    // Aucune préférence : on récupère au moins le thème déjà choisi
    const legacyTheme = window.localStorage.getItem(legacyThemeKey);

    if (legacyTheme === "light" || legacyTheme === "dark") {
      return JSON.stringify({
        state: { ...defaultSettings, theme: legacyTheme },
        version: 1,
      });
    }

    return null;
  },
  setItem: (name: string, value: string) => {
    window.localStorage.setItem(name, value);

    try {
      const { state } = JSON.parse(value);

      // Maintenue à jour tant que d'autres écrans lisent cette clé
      window.localStorage.setItem(legacyThemeKey, state.theme);
    } catch {
      /* le thème sera resynchronisé à la prochaine écriture */
    }
  },
  removeItem: (name: string) => window.localStorage.removeItem(name),
}));

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (patch) => set(patch),

      resetSettings: () => set({ ...defaultSettings }),
    }),
    {
      name: storageKey,
      version: 1,
      storage,
      // Les clés absentes retombent sur la valeur par défaut : un réglage
      // ajouté plus tard n'invalide pas les préférences enregistrées.
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<AppSettings>),
      }),
      // Seules les préférences sont persistées, jamais les actions
      partialize: (state) => ({
        theme: state.theme,
        accent: state.accent,
        density: state.density,
        collapsedSidebar: state.collapsedSidebar,
        landingPage: state.landingPage,
        alerts: state.alerts,
      }),
    },
  ),
);
