import { useSettings } from "../hooks/useSettings";

import {
  accentLabels,
  densityLabels,
  type AccentColor,
  type Density,
} from "../types/settings.types";

const accents: AccentColor[] = [
  "indigo",
  "violet",
  "emerald",
  "amber",
  "rose",
];

const densities: Density[] = ["comfortable", "compact"];

export default function AppearanceSettings() {
  const { settings, setSetting } = useSettings();

  return (
    <section className="dashboard-card settings-card" id="apparence">
      <div className="card-heading">
        <div>
          <h3>Apparence</h3>

          <p>Réglages appliqués immédiatement à toute l'application</p>
        </div>
      </div>

      {/* ========================= */}
      {/* THEME                     */}
      {/* ========================= */}

      <div className="settings-row">
        <div className="settings-row-label">
          <strong>Thème</strong>

          <span>Clair pour la journée, sombre pour les longues sessions</span>
        </div>

        <div className="settings-choices">
          <button
            type="button"
            className={`settings-choice ${settings.theme === "light" ? "active" : ""}`}
            onClick={() => setSetting("theme", "light")}
            aria-pressed={settings.theme === "light"}
          >
            <span className="settings-choice-icon">☀</span>
            Clair
          </button>

          <button
            type="button"
            className={`settings-choice ${settings.theme === "dark" ? "active" : ""}`}
            onClick={() => setSetting("theme", "dark")}
            aria-pressed={settings.theme === "dark"}
          >
            <span className="settings-choice-icon">☾</span>
            Sombre
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* COULEUR D'ACCENT          */}
      {/* ========================= */}

      <div className="settings-row">
        <div className="settings-row-label">
          <strong>Couleur d'accent</strong>

          <span>Boutons, liens actifs, barres de progression</span>
        </div>

        <div className="accent-picker">
          {accents.map((accent) => (
            <button
              type="button"
              key={accent}
              className={`accent-swatch accent-${accent} ${
                settings.accent === accent ? "active" : ""
              }`}
              onClick={() => setSetting("accent", accent)}
              aria-pressed={settings.accent === accent}
              aria-label={accentLabels[accent]}
              title={accentLabels[accent]}
            />
          ))}
        </div>
      </div>

      {/* ========================= */}
      {/* DENSITE                   */}
      {/* ========================= */}

      <div className="settings-row">
        <div className="settings-row-label">
          <strong>Densité d'affichage</strong>

          <span>
            Compact resserre les marges pour afficher plus de contenu
          </span>
        </div>

        <div className="settings-choices">
          {densities.map((density) => (
            <button
              type="button"
              key={density}
              className={`settings-choice ${
                settings.density === density ? "active" : ""
              }`}
              onClick={() => setSetting("density", density)}
              aria-pressed={settings.density === density}
            >
              {densityLabels[density]}
            </button>
          ))}
        </div>
      </div>

      {/* ========================= */}
      {/* SIDEBAR                   */}
      {/* ========================= */}

      <div className="settings-row">
        <div className="settings-row-label">
          <strong>Menu latéral réduit</strong>

          <span>N'affiche que les icônes et libère de la largeur</span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={settings.collapsedSidebar}
          className={`settings-switch ${settings.collapsedSidebar ? "on" : ""}`}
          onClick={() =>
            setSetting("collapsedSidebar", !settings.collapsedSidebar)
          }
        >
          <span />
        </button>
      </div>
    </section>
  );
}
