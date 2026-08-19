import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../shared/components/AppLayout";

import DashboardPage from "../features/dashboard/components/DashboardPage";
import ProjectsPage from "../features/pms/components/ProjectsPage";
import EmployeesPage from "../features/hrm/components/EmployeesPage";
import ClientsPage from "../features/crm/components/ClientsPage";
import ProductsPage from "../features/erp/components/ProductsPage";
import BIPage from "../features/bi/components/BIPage";
import SettingsPage from "../features/settings/components/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "pms",
        element: <ProjectsPage />,
      },
      {
        path: "hrm",
        element: <EmployeesPage />,
      },
      {
        path: "crm",
        element: <ClientsPage />,
      },
      {
        path: "erp",
        element: <ProductsPage />,
      },
      {
        path: "bi",
        element: <BIPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);