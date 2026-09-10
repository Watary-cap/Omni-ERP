import { memo, useCallback } from "react";

import { useSettings } from "../hooks/useSettings";

import { useToggleList } from "../../../shared/patterns/useToggleList";
import DataFetcher from "../../../shared/patterns/DataFetcher";

import {
  MAX_ALERTS,
  alertLabels,
  type AlertKind,
} from "../types/settings.types";

import { getLeaves } from "../../hrm/services/employeeService";

const kinds = Object.keys(alertLabels) as AlertKind[];

interface AlertChipProps {
  kind: AlertKind;
  actif: boolean;
  desactive: boolean;
  onToggle: (kind: AlertKind) => void;
}

/* Mémoïsée : basculer une alerte ne doit re-rendre que celle-ci. */
const AlertChip = memo(function AlertChip({
  kind,
  actif,
  desactive,
  onToggle,
}: AlertChipProps) {
  return (
    <button
      type="button"
      className={`category-chip ${actif ? "active" : ""}`}
      onClick={() => onToggle(kind)}
      disabled={desactive}
      aria-pressed={actif}
    >
      {alertLabels[kind]}
    </button>
  );
});

export default function AlertsSettings() {
  const { settings, setSetting } = useSettings();

  /* State reducer pattern : le comportement par défaut d'une liste à
     bascule est réutilisé, mais on refuse toute sélection au-delà de la
     limite au lieu de réécrire la logique. */
  const { selected, toggle, isSelected } = useToggleList(
    settings.alerts,
    (state, action, proposed) => {
      if (action.type === "toggle" && proposed.length > MAX_ALERTS) {
        return state;
      }

      setSetting("alerts", proposed as AlertKind[]);

      return proposed;
    },
  );

  const limiteAtteinte = selected.length >= MAX_ALERTS;

  const handleToggle = useCallback(
    (kind: AlertKind) => toggle(kind),
    [toggle],
  );

  return (
    <section className="dashboard-card settings-card" id="alertes">
      <div className="card-heading">
        <div>
          <h3>Alertes</h3>

          <p>
            Choisissez ce que la barre du haut doit surveiller — {MAX_ALERTS}{" "}
            au maximum
          </p>
        </div>

        <span className="card-counter">
          {selected.length} / {MAX_ALERTS}
        </span>
      </div>

      <div className="alert-picker">
        {kinds.map((kind) => {
          const actif = isSelected(kind);

          return (
            <AlertChip
              key={kind}
              kind={kind}
              actif={actif}
              desactive={!actif && limiteAtteinte}
              onToggle={handleToggle}
            />
          );
        })}
      </div>

      {limiteAtteinte && (
        <p className="settings-note">
          Limite atteinte : désélectionnez une alerte pour en choisir une autre.
        </p>
      )}

      {/* Render props : la logique de chargement est mutualisée,
          l'affichage reste défini ici. */}
      {isSelected("leaves") && (
        <DataFetcher queryKey={["leaves"]} queryFn={getLeaves}>
          {({ data, isLoading, error }) => (
            <div className="settings-row">
              <div className="settings-row-label">
                <strong>Congés en attente</strong>

                <span>
                  {isLoading
                    ? "Chargement..."
                    : error
                      ? "Donnée indisponible"
                      : "Nombre de demandes actuellement à valider"}
                </span>
              </div>

              <strong className="product-stock-current">
                {isLoading || error
                  ? "—"
                  : (data ?? []).filter((leave) => leave.status === "pending")
                      .length}
              </strong>
            </div>
          )}
        </DataFetcher>
      )}
    </section>
  );
}
