import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "../shared/components/AppLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

/* La page de connexion est la première vue affichée : elle reste dans le
   bundle initial. Tous les modules métier sont chargés à la demande, ce
   qui évite de télécharger le CRM pour consulter le tableau de bord. */
import LoginPage from "../features/auth/components/LoginPage";

const DashboardPage = lazy(
  () => import("../features/dashboard/components/DashboardPage"),
);
const ProjectsPage = lazy(
  () => import("../features/pms/components/ProjectsPage"),
);
const EmployeesPage = lazy(() => import("../features/hrm/EmployeesPage"));
const ClientsPage = lazy(
  () => import("../features/crm/components/ClientsPage"),
);
const ProductsPage = lazy(
  () => import("../features/erp/components/ProductsPage"),
);
const BIPage = lazy(() => import("../features/bi/components/BIPage"));
const SettingsPage = lazy(
  () => import("../features/settings/components/SettingsPage"),
);
const HealthPage = lazy(
  () => import("../features/health/components/HealthPage"),
);

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="hrm-loading">
          <div className="loading-spinner" />

          <p>Chargement du module...</p>
        </div>
      }
    >
      {element}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "dashboard", element: withSuspense(<DashboardPage />) },
          { path: "pms", element: withSuspense(<ProjectsPage />) },
          { path: "hrm", element: withSuspense(<EmployeesPage />) },
          { path: "crm", element: withSuspense(<ClientsPage />) },
          { path: "erp", element: withSuspense(<ProductsPage />) },
          { path: "bi", element: withSuspense(<BIPage />) },
          { path: "settings", element: withSuspense(<SettingsPage />) },
          { path: "health", element: withSuspense(<HealthPage />) },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
