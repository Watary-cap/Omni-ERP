import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "../shared/components/AppLayout";

import LoginPage from "../features/auth/components/LoginPage";

import DashboardPage from "../features/dashboard/components/DashboardPage";
import ProjectsPage from "../features/pms/components/ProjectsPage";
import EmployeesPage from "../features/hrm/EmployeesPage";
import ClientsPage from "../features/crm/components/ClientsPage";
import ProductsPage from "../features/erp/components/ProductsPage";
import BIPage from "../features/bi/components/BIPage";
import SettingsPage from "../features/settings/components/SettingsPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

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
          { path: "dashboard", element: <DashboardPage /> },
          { path: "pms", element: <ProjectsPage /> },
          { path: "hrm", element: <EmployeesPage /> },
          { path: "crm", element: <ClientsPage /> },
          { path: "erp", element: <ProductsPage /> },
          { path: "bi", element: <BIPage /> },
          {
            element: (
              <ProtectedRoute
                allowedRoles={["admin", "manager", "super_manager", "ceo"]}
              />
            ),
            children: [{ path: "settings", element: <SettingsPage /> }],
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
