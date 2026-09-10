import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ErrorBoundary from "./ErrorBoundary";
import NotificationHost from "./NotificationHost";

import { useSettings } from "../../features/settings/hooks/useSettings";

export default function AppLayout() {
  /* Les préférences vivent dans un store partagé : la barre du haut et
     la page Paramètres pilotent le même état. */
  const { shellClassName, isDarkTheme, toggleTheme } = useSettings();

  return (
    <div className={shellClassName}>
      <Sidebar />

      <div className="app-main">
        <Header isDarkTheme={isDarkTheme} onToggleTheme={toggleTheme} />

        <main className="app-content">
          {/* Une page en erreur ne doit pas emporter la navigation */}
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      <NotificationHost />
    </div>
  );
}
