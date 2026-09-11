import { memo } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "⌂" },
  { to: "/pms", label: "Projets", icon: "▦" },
  { to: "/hrm", label: "Employés", icon: "👥" },
  { to: "/crm", label: "Clients", icon: "◉" },
  { to: "/erp", label: "Produits", icon: "▣" },
  { to: "/bi", label: "Analytics", icon: "◫" },
  { to: "/settings", label: "Paramètres", icon: "⚙" },
  { to: "/health", label: "Santé", icon: "♥" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">O</div>

        <div>
          <h2>Omni-ERP</h2>
          <span>Enterprise Suite</span>
        </div>
      </div>

      <div className="sidebar-section-title">ESPACE DE TRAVAIL</div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/dashboard"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-help">
          <strong>Besoin d'aide ?</strong>
          <span>Consultez la documentation</span>
        </div>
      </div>
    </aside>
  );
}

/* Le contenu du menu ne dépend d'aucune prop : inutile de le reconstruire
   à chaque navigation. Les NavLink s'abonnent eux-mêmes au routeur et
   continuent de refléter la route active. */
export default memo(Sidebar);
