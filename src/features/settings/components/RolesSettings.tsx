import { memo } from "react";

import { useAuth } from "../../auth/hooks/useAuth";
import { withPermissions } from "../../../shared/patterns/withAuth";

import type { UserRole } from "../../auth/types/auth.types";

interface Capability {
  label: string;
  roles: UserRole[];
}

/* Reflète le cloisonnement réellement appliqué dans l'application. */
const capabilities: Capability[] = [
  {
    label: "Voir l'organigramme complet",
    roles: ["admin", "super_manager", "ceo"],
  },
  {
    label: "Voir uniquement son équipe",
    roles: ["manager"],
  },
  {
    label: "Voir uniquement sa propre fiche",
    roles: ["user"],
  },
  {
    label: "Créer un employé",
    roles: ["admin", "super_manager", "manager", "ceo"],
  },
  {
    label: "Valider une demande de congé",
    roles: ["admin", "super_manager", "manager", "ceo"],
  },
  {
    label: "Demander un congé",
    roles: ["manager", "user"],
  },
];

const roleOrder: UserRole[] = [
  "ceo",
  "admin",
  "super_manager",
  "manager",
  "user",
];

const roleLabels: Record<UserRole, string> = {
  ceo: "Directeur",
  admin: "Admin",
  super_manager: "Super mgr",
  manager: "Manager",
  user: "Salarié",
};

interface CapabilityRowProps {
  capability: Capability;
  roles: UserRole[];
  currentRole?: UserRole;
}

/* Mémoïsée : la matrice compte six lignes constantes, il est inutile de
   les reconstruire quand seule la session change. */
const CapabilityRow = memo(function CapabilityRow({
  capability,
  roles,
  currentRole,
}: CapabilityRowProps) {
  return (
    <tr>
      <td>{capability.label}</td>

      {roles.map((role) => (
        <td key={role} className={role === currentRole ? "current" : ""}>
          {capability.roles.includes(role) ? (
            <span className="role-yes" aria-label="autorisé">
              ✓
            </span>
          ) : (
            <span className="role-no" aria-label="non autorisé">
              —
            </span>
          )}
        </td>
      ))}
    </tr>
  );
});

function RolesSettings() {
  const { user } = useAuth();

  return (
    <section className="dashboard-card settings-card" id="roles">
      <div className="card-heading">
        <div>
          <h3>Rôles et accès</h3>

          <p>Ce que chaque profil peut faire dans l'application</p>
        </div>

        <span className="card-counter">lecture seule</span>
      </div>

      <div className="employee-table-wrapper">
        <table className="employee-table roles-table">
          <thead>
            <tr>
              <th>Capacité</th>

              {roleOrder.map((role) => (
                <th key={role} className={role === user?.role ? "current" : ""}>
                  {roleLabels[role]}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {capabilities.map((capability) => (
              <CapabilityRow
                key={capability.label}
                capability={capability}
                roles={roleOrder}
                currentRole={user?.role}
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className="settings-note">
        Cette matrice documente les règles appliquées dans le code. Elle n'est
        pas modifiable depuis cet écran : les droits sont définis à la
        connexion, à partir du rôle du compte.
      </p>
    </section>
  );
}

/* Le contrôle d'accès est délégué au HOC : le composant ne sait plus
   qui a le droit de le voir, il se contente d'afficher la matrice. */
export default withPermissions(RolesSettings, [
  "admin",
  "super_manager",
  "ceo",
]);
