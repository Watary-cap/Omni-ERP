import Tabs from "../../../shared/components/Tabs";

import ProfileSettings from "./ProfileSettings";
import AppearanceSettings from "./AppearanceSettings";
import PreferencesSettings from "./PreferencesSettings";
import AlertsSettings from "./AlertsSettings";
import RolesSettings from "./RolesSettings";
import DataSettings from "./DataSettings";

import { useAuth } from "../../auth/hooks/useAuth";

export default function SettingsPage() {
  const { hasRole } = useAuth();

  const canSeeRoles = hasRole(["admin", "super_manager", "ceo"]);

  return (
    <div className="dashboard settings-page">
      <div className="dashboard-heading">
        <div>
          <span className="welcome-label">CONFIGURATION</span>

          <h1>Paramètres</h1>

          <p>
            Personnalisez l'affichage, vos préférences de navigation et votre
            compte.
          </p>
        </div>
      </div>

      {/* Compound component : l'onglet actif est partagé par contexte,
          l'appelant décrit simplement la structure. */}
      <Tabs defaultValue="apparence">
        <Tabs.List>
          <Tabs.Trigger value="apparence" icon="◐">
            Apparence
          </Tabs.Trigger>

          <Tabs.Trigger value="preferences" icon="⚙">
            Préférences
          </Tabs.Trigger>

          <Tabs.Trigger value="alertes" icon="🔔">
            Alertes
          </Tabs.Trigger>

          <Tabs.Trigger value="profil" icon="👤">
            Profil
          </Tabs.Trigger>

          <Tabs.Trigger value="donnees" icon="⇄">
            Données
          </Tabs.Trigger>

          {canSeeRoles && (
            <Tabs.Trigger value="roles" icon="🔒">
              Rôles et accès
            </Tabs.Trigger>
          )}
        </Tabs.List>

        <Tabs.Panel value="apparence">
          <AppearanceSettings />
        </Tabs.Panel>

        <Tabs.Panel value="preferences">
          <PreferencesSettings />
        </Tabs.Panel>

        <Tabs.Panel value="alertes">
          <AlertsSettings />
        </Tabs.Panel>

        <Tabs.Panel value="profil">
          <ProfileSettings />
        </Tabs.Panel>

        <Tabs.Panel value="donnees">
          <DataSettings />
        </Tabs.Panel>

        <Tabs.Panel value="roles">
          <RolesSettings />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
