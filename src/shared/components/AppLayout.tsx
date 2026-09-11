import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ErrorBoundary from "./ErrorBoundary";
import NotificationHost from "./NotificationHost";

import { useSettings } from "../../features/settings/hooks/useSettings";
import { useAnalytics } from "../analytics/useAnalytics";

export default function AppLayout() {
  const location = useLocation();
  const { trackPageView } = useAnalytics();
  /* Les préférences vivent dans un store partagé : la barre du haut et
     la page Paramètres pilotent le même état. */
  const { shellClassName, isDarkTheme, toggleTheme } = useSettings();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

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
