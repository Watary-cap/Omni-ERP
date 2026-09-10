import type { ComponentType } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/authStore";

import type { UserRole } from "../../features/auth/types/auth.types";

/**
 * HOC : enveloppe un composant et n'en rend le contenu qu'à un utilisateur
 * connecté. Le composant enveloppé ignore tout de l'authentification.
 */
export function withAuth<P extends object>(Wrapped: ComponentType<P>) {
  function WithAuth(props: P) {
    const user = useAuthStore((state) => state.user);

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return <Wrapped {...props} />;
  }

  WithAuth.displayName = `withAuth(${Wrapped.displayName ?? Wrapped.name ?? "Composant"})`;

  return WithAuth;
}

/**
 * HOC : restreint un composant à une liste de rôles. Rend `fallback`
 * (rien par défaut) quand le rôle courant n'est pas autorisé.
 */
export function withPermissions<P extends object>(
  Wrapped: ComponentType<P>,
  allowedRoles: UserRole[],
  fallback: ComponentType | null = null,
) {
  function WithPermissions(props: P) {
    const user = useAuthStore((state) => state.user);

    if (!user || !allowedRoles.includes(user.role)) {
      const Fallback = fallback;

      return Fallback ? <Fallback /> : null;
    }

    return <Wrapped {...props} />;
  }

  WithPermissions.displayName = `withPermissions(${Wrapped.displayName ?? Wrapped.name ?? "Composant"})`;

  return WithPermissions;
}
