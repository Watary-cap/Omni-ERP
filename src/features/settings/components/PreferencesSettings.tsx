import { useState } from "react";

import Modal from "../../../shared/components/Modal";

import { useSettings } from "../hooks/useSettings";
import { notify } from "../../../shared/patterns/eventBus";

import { landingPageLabels, type LandingPage } from "../types/settings.types";

const landingPages = Object.keys(landingPageLabels) as LandingPage[];

export default function PreferencesSettings() {
  const { settings, setSetting, resetSettings } = useSettings();

  const [confirmReset, setConfirmReset] = useState(false);

  function handleReset() {
    resetSettings();
    setConfirmReset(false);

    // Observer : l'hôte de notifications réagit sans être couplé ici
    notify("Préférences réinitialisées.", "success");
  }

  return (
    <section className="dashboard-card settings-card" id="preferences">
      <div className="card-heading">
        <div>
          <h3>Préférences</h3>

          <p>Comportement de l'application pour ce navigateur</p>
        </div>
      </div>

      <div className="settings-row">
        <div className="settings-row-label">
          <strong>Page d'accueil</strong>

          <span>Écran ouvert juste après la connexion</span>
        </div>

        <select
          className="settings-select"
          value={settings.landingPage}
          onChange={(event) => {
            setSetting("landingPage", event.target.value as LandingPage);
            notify(
              `Page d'accueil : ${landingPageLabels[event.target.value as LandingPage]}.`,
            );
          }}
          aria-label="Page d'accueil après connexion"
        >
          {landingPages.map((page) => (
            <option value={page} key={page}>
              {landingPageLabels[page]}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-row danger">
        <div className="settings-row-label">
          <strong>Réinitialiser les préférences</strong>

          <span>
            Remet thème, couleur, densité, menu, alertes et page d'accueil aux
            valeurs d'origine. N'affecte ni votre compte ni les données métier.
          </span>
        </div>

        <button
          type="button"
          className="danger-button"
          onClick={() => setConfirmReset(true)}
        >
          Réinitialiser
        </button>
      </div>

      {/* Portail : la confirmation sort du flux de la page */}
      <Modal
        isOpen={confirmReset}
        title="Réinitialiser les préférences ?"
        onClose={() => setConfirmReset(false)}
      >
        <p className="settings-note">
          Vos réglages d'affichage reviendront à leur valeur d'origine. Cette
          action ne touche ni votre compte ni les données de l'application.
        </p>

        <div className="employee-form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setConfirmReset(false)}
          >
            Annuler
          </button>

          <button type="button" className="danger-button" onClick={handleReset}>
            Confirmer
          </button>
        </div>
      </Modal>
    </section>
  );
}
