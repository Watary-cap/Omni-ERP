import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "24px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Omni-ERP</h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <NavLink to="/" style={{ color: "white" }}>
          Dashboard
        </NavLink>

        <NavLink to="/pms" style={{ color: "white" }}>
          PMS - Projets
        </NavLink>

        <NavLink to="/hrm" style={{ color: "white" }}>
          HRM - Employés
        </NavLink>

        <NavLink to="/crm" style={{ color: "white" }}>
          CRM - Clients
        </NavLink>

        <NavLink to="/erp" style={{ color: "white" }}>
          ERP - Produits
        </NavLink>

        <NavLink to="/bi" style={{ color: "white" }}>
          BI - Analytics
        </NavLink>

        <NavLink to="/settings" style={{ color: "white" }}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}