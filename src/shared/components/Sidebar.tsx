import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "⌂" },
  { to: "/pms", label: "Projets", icon: "▦" },
  { to: "/hrm", label: "Employés", icon: "👥" },
  { to: "/crm", label: "Clients", icon: "◉" },
  { to: "/erp", label: "Produits", icon: "▣" },
  { to: "/bi", label: "Analytics", icon: "◫" },
  { to: "/settings", label: "Paramètres", icon: "⚙" },
];

export default function Sidebar() {
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
            end={link.to === "/"}
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