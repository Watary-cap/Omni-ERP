import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.localStorage.getItem("omni-erp-theme") !== "light";
  });

  const toggleTheme = () => {
    setIsDarkTheme((current) => {
      const next = !current;
      window.localStorage.setItem("omni-erp-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className={`app-shell ${isDarkTheme ? "dark-theme" : ""}`}>
      <Sidebar />

      <div className="app-main">
        <Header isDarkTheme={isDarkTheme} onToggleTheme={toggleTheme} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
