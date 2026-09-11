import { useRef, useState } from "react";

import { notify } from "../../../shared/patterns/eventBus";
import { useSettings } from "../hooks/useSettings";
import type { AppSettings } from "../types/settings.types";
import {
  accentLabels,
  alertLabels,
  densityLabels,
  landingPageLabels,
} from "../types/settings.types";

function isSettings(value: unknown): value is AppSettings {
  if (!value || typeof value !== "object") return false;

  const settings = value as Partial<AppSettings>;
  return (
    (settings.theme === "light" || settings.theme === "dark") &&
    typeof settings.accent === "string" &&
    settings.accent in accentLabels &&
    typeof settings.density === "string" &&
    settings.density in densityLabels &&
    typeof settings.collapsedSidebar === "boolean" &&
    typeof settings.landingPage === "string" &&
    settings.landingPage in landingPageLabels &&
    Array.isArray(settings.alerts) &&
    settings.alerts.every((alert) => alert in alertLabels)
  );
}

export default function DataSettings() {
  const { settings, updateSettings } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  function exportSettings() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "omni-erp-preferences.json";
    link.click();
    URL.revokeObjectURL(url);
    notify("Préférences exportées.", "success");
  }

  async function importSettings(file: File) {
    setImporting(true);
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isSettings(parsed)) {
        throw new Error("Format invalide");
      }

      updateSettings(parsed);
      notify("Préférences importées.", "success");
    } catch {
      notify("Ce fichier ne contient pas des préférences valides.", "error");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <section className="dashboard-card settings-card" id="donnees">
      <div className="card-heading">
        <div>
          <h3>Données et sauvegarde</h3>
          <p>Transférez vos préférences vers un autre navigateur ou poste.</p>
        </div>
      </div>

      <div className="settings-row">
        <div className="settings-row-label">
          <strong>Exporter mes préférences</strong>
          <span>Télécharge un fichier JSON avec vos réglages actuels.</span>
        </div>
        <button type="button" className="secondary-button" onClick={exportSettings}>
          Exporter
        </button>
      </div>

      <div className="settings-row">
        <div className="settings-row-label">
          <strong>Importer des préférences</strong>
          <span>Remplace les réglages actuels après validation du fichier.</span>
        </div>
        <button
          type="button"
          className="secondary-button"
          disabled={importing}
          onClick={() => fileInputRef.current?.click()}
        >
          {importing ? "Import..." : "Importer"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importSettings(file);
          }}
        />
      </div>
    </section>
  );
}
