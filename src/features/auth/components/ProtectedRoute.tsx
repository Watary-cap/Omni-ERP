import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import type { UserRole } from "../types/auth.types";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // L'utilisateur est connecté : on le ramène dans l'application,
    // pas sur l'écran de connexion.
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
