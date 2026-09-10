import { useNavigate } from "react-router-dom";

import { useCRM } from "../../crm/hooks/useCRM";
import { useEmployees } from "../../hrm/hooks/useEmployees";
import { useProjects } from "../../pms/hooks/useProjects";

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const projectsQuery = useProjects();
  const employeesQuery = useEmployees();
  const crm = useCRM();

  const projects = projectsQuery.data ?? [];
  const employees = employeesQuery.data ?? [];
  const clients = crm.clients;
  const activeProjects = projects.filter(
    (project) => project.status === "in_progress",
  );
  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  );
  const activeClients = clients.filter(
    (client) => client.status?.toLowerCase() === "active",
  );
  const completionRate = projects.length
    ? Math.round(
        projects.reduce((total, project) => total + project.progress, 0) /
          projects.length,
      )
    : 0;
  const averageProgress = activeProjects.length
    ? Math.round(
        activeProjects.reduce((total, project) => total + project.progress, 0) /
          activeProjects.length,
      )
    : 0;
  const loading =
    projectsQuery.isLoading || employeesQuery.isLoading || crm.loading;
  const hasError = projectsQuery.isError || employeesQuery.isError || Boolean(crm.error);
  const stats = [
    ["Projets actifs", formatNumber(activeProjects.length), `${projects.length} au total`, "▦"],
    ["Employés actifs", formatNumber(activeEmployees.length), `${employees.length} dans HRM`, "👥"],
    ["Clients actifs", formatNumber(activeClients.length), `${clients.length} dans CRM`, "◉"],
    ["Progression moyenne", `${completionRate}%`, "sur l'ensemble des projets", "↗"],
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Vue générale des performances de GlobalTech Solutions.</p>
        </div>
        <button className="primary-button" onClick={() => navigate("/pms")}>
          + Nouveau projet
        </button>
      </div>

      {hasError && (
        <div className="dashboard-alert">
          Certaines données ne sont pas disponibles. Vérifiez que JSON Server est lancé sur le port 3000.
        </div>
      )}

      <div className="stats-grid">
        {stats.map(([title, value, subtitle, icon]) => (
          <article className="stat-card" key={title}>
            <div className="stat-card-top">
              <div className="stat-icon">{icon}</div>
              <span className="stat-change">À jour</span>
            </div>
            <span className="stat-title">{title}</span>
            <strong className="stat-value">{loading ? "..." : value}</strong>
            <span className="stat-subtitle">{subtitle}</span>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-card-large">
          <div className="card-heading">
            <div>
              <h3>Performance des projets</h3>
              <p>Progression actuelle par projet</p>
            </div>
            <span className="card-counter">{completionRate}% moyen</span>
          </div>
          {loading ? <div className="dashboard-loading">Chargement des données...</div> : projects.length === 0 ? (
            <div className="empty-state compact-empty"><strong>Aucun projet à afficher</strong><p>Créez votre premier projet depuis le module PMS.</p></div>
          ) : (
            <div className="project-progress-list">
              {projects.slice(0, 5).map((project) => (
                <div className="project-row" key={project.id}>
                  <div><strong>{project.title}</strong><span>{project.status === "completed" ? "Terminé" : `Échéance ${formatDate(project.endDate)}`}</span></div>
                  <div className="progress-container"><div className="progress-bar"><div style={{ width: `${project.progress}%` }} /></div><strong>{project.progress}%</strong></div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Activité récente</h3>
              <p>Éléments suivis dans les modules</p>
            </div>
          </div>
          <div className="activity-list">
            <div className="activity-item"><div className="activity-dot">PMS</div><div><strong>{activeProjects.length} projet(s) en cours</strong><span>Progression moyenne : {averageProgress}%</span></div></div>
            <div className="activity-item"><div className="activity-dot">HRM</div><div><strong>{activeEmployees.length} employés actifs</strong><span>Effectif synchronisé</span></div></div>
            <div className="activity-item"><div className="activity-dot">CRM</div><div><strong>{activeClients.length} clients actifs</strong><span>Portefeuille client synchronisé</span></div></div>
          </div>
        </section>
      </div>

      <div className="dashboard-grid bottom-grid">
        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Vue PMS</h3>
              <p>Répartition des projets</p>
            </div>
            <button className="text-button" onClick={() => navigate("/pms")}>Voir les projets</button>
          </div>
          <div className="inventory-stat"><span>En cours</span><strong>{activeProjects.length}</strong></div>
          <div className="inventory-stat"><span>Planifiés</span><strong>{projects.filter((project) => project.status === "planned").length}</strong></div>
          <div className="inventory-stat"><span>Terminés</span><strong>{projects.filter((project) => project.status === "completed").length}</strong></div>
        </section>

        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Données ERP</h3>
              <p>État du module ressources</p>
            </div>
          </div>
          <div className="erp-placeholder"><div className="empty-state-icon">◫</div><strong>Module ERP à connecter</strong><p>Les stocks et commandes seront affichés ici dès leur intégration.</p></div>
        </section>
      </div>
    </div>
  );
}