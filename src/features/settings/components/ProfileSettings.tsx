import { useActionState } from "react";

import SubmitButton from "../../../shared/components/SubmitButton";

import { useAuth } from "../../auth/hooks/useAuth";
import { useAuthStore } from "../../auth/store/authStore";
import { useEmployees } from "../../hrm/hooks/useEmployees";

import { updatePassword } from "../services/profileService";
import { notify } from "../../../shared/patterns/eventBus";

import type { AuthUser } from "../../auth/types/auth.types";

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  super_manager: "Super manager",
  manager: "Manager",
  user: "Salarié",
  ceo: "Directeur général",
};

interface ActionResult {
  status: "idle" | "error" | "done";
  message: string;
}

const initialResult: ActionResult = { status: "idle", message: "" };

/* L'action est définie hors du composant et reçoit ce dont elle a besoin :
   elle reste testable et ne capture pas de rendu. */
function createChangePasswordAction(
  user: AuthUser,
  onSuccess: (password: string) => void,
) {
  return async function changePassword(
    _previous: ActionResult,
    formData: FormData,
  ): Promise<ActionResult> {
    const current = String(formData.get("currentPassword") ?? "");
    const next = String(formData.get("newPassword") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (current !== user.password) {
      return { status: "error", message: "Le mot de passe actuel est incorrect." };
    }

    if (next.length < 4) {
      return {
        status: "error",
        message: "Le nouveau mot de passe doit faire au moins 4 caractères.",
      };
    }

    if (next !== confirm) {
      return {
        status: "error",
        message: "La confirmation ne correspond pas au nouveau mot de passe.",
      };
    }

    if (next === current) {
      return {
        status: "error",
        message: "Le nouveau mot de passe est identique à l'ancien.",
      };
    }

    try {
      await updatePassword(user.id, next);

      onSuccess(next);

      return {
        status: "done",
        message:
          "Mot de passe mis à jour. Il sera demandé à la prochaine connexion.",
      };
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe :", error);

      return {
        status: "error",
        message: "La mise à jour a échoué. Vérifiez que JSON Server tourne.",
      };
    }
  };
}

export default function ProfileSettings() {
  const { user } = useAuth();
  const updateUser = useAuthStore((state) => state.updateUser);
  const employeesQuery = useEmployees();

  /* React 19 — `useActionState` porte à lui seul le résultat de l'action :
     ni état de chargement, ni état d'erreur à gérer à la main. */
  const [result, formAction] = useActionState(
    createChangePasswordAction(user as AuthUser, (password) => {
      updateUser({ password });
      notify("Mot de passe mis à jour.", "success");
    }),
    initialResult,
  );

  if (!user) {
    return null;
  }

  // Fiche RH rattachée au compte, quand elle existe
  const employee = (employeesQuery.data ?? []).find(
    (item) => String(item.id) === String(user.employeeId),
  );

  return (
    <section className="dashboard-card settings-card" id="profil">
      <div className="card-heading">
        <div>
          <h3>Profil</h3>

          <p>Compte utilisé pour cette session</p>
        </div>
      </div>

      <div className="settings-identity">
        <div className="settings-avatar">
          {user.username.slice(0, 2).toUpperCase()}
        </div>

        <div>
          <strong>{user.username}</strong>

          <span>{roleLabels[user.role] ?? user.role}</span>
        </div>
      </div>

      <div className="employee-details">
        <div>
          <span>Identifiant</span>
          <strong>{user.username}</strong>
        </div>

        <div>
          <span>Rôle</span>
          <strong>{roleLabels[user.role] ?? user.role}</strong>
        </div>

        <div>
          <span>Fiche RH liée</span>
          <strong>
            {employee
              ? `${employee.firstName} ${employee.lastName}`
              : "Aucune fiche rattachée"}
          </strong>
        </div>

        <div>
          <span>Poste</span>
          <strong>{employee?.jobTitle ?? "—"}</strong>
        </div>
      </div>

      {/* ========================= */}
      {/* MOT DE PASSE              */}
      {/* ========================= */}

      <form className="settings-form" action={formAction}>
        <h4>Changer le mot de passe</h4>

        <div className="settings-form-grid">
          <div className="form-group">
            <label htmlFor="currentPassword">Mot de passe actuel</label>

            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmation</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        {result.status === "error" && (
          <p className="settings-message error">{result.message}</p>
        )}

        {result.status === "done" && (
          <p className="settings-message success">{result.message}</p>
        )}

        <div className="employee-form-actions">
          <SubmitButton pendingLabel="Enregistrement...">
            Mettre à jour
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}
