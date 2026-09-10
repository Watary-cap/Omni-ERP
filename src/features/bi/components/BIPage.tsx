import { useCRM } from "../../crm/hooks/useCRM";
import { useEmployees } from "../../hrm/hooks/useEmployees";
import { useProjects } from "../../pms/hooks/useProjects";

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="stat-card">
      <span className="stat-title">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-subtitle">{detail}</span>
    </article>
  );
}

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bi-bar-row">
      <div className="bi-bar-label"><span>{label}</span><strong>{value}</strong></div>
      <div className="bi-bar-track"><div className="bi-bar-fill" style={{ width: `${percentage}%`, background: color }} /></div>
      <small>{percentage}%</small>
    </div>
  );
}

export default function BIPage() {
  const projectsQuery = useProjects();
  const employeesQuery = useEmployees();
  const crm = useCRM();
  const projects = projectsQuery.data ?? [];
  const employees = employeesQuery.data ?? [];
  const clients = crm.clients;
  const completedProjects = projects.filter((project) => project.status === "completed").length;
  const activeEmployees = employees.filter((employee) => employee.status === "active").length;
  const averageProgress = projects.length
    ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
    : 0;
  const loading = projectsQuery.isLoading || employeesQuery.isLoading || crm.loading;
  const error = projectsQuery.isError || employeesQuery.isError || Boolean(crm.error);

  if (loading) {
    return <div className="bi-page"><div className="dashboard-card bi-feedback">Chargement des indicateurs...</div></div>;
  }

  return (
    <div className="bi-page">
      <div className="dashboard-heading">
        <div><h1>Business Intelligence</h1><p>Analyse consolidée des performances de l'entreprise.</p></div>
        <span className="bi-status">{error ? "Données partielles" : "Données à jour"}</span>
      </div>

      <div className="stats-grid">
        <Metric label="Projets suivis" value={`${projects.length}`} detail={`${completedProjects} terminé(s)`} />
        <Metric label="Progression moyenne" value={`${averageProgress}%`} detail="sur tous les projets" />
        <Metric label="Effectif actif" value={`${activeEmployees}`} detail={`${employees.length} employé(s) référencé(s)`} />
        <Metric label="Portefeuille clients" value={`${clients.length}`} detail="clients CRM" />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-heading"><div><h3>Répartition des projets</h3><p>État du portefeuille PMS</p></div></div>
          <Bar label="En cours" value={projects.filter((project) => project.status === "in_progress").length} total={projects.length} color="#6366f1" />
          <Bar label="Planifiés" value={projects.filter((project) => project.status === "planned").length} total={projects.length} color="#38bdf8" />
          <Bar label="Terminés" value={completedProjects} total={projects.length} color="#10b981" />
          <Bar label="En pause" value={projects.filter((project) => project.status === "on_hold").length} total={projects.length} color="#f59e0b" />
        </section>

        <section className="dashboard-card">
          <div className="card-heading"><div><h3>Statut clients</h3><p>Segmentation CRM</p></div></div>
          <Bar label="Actifs" value={clients.filter((client) => client.status === "active").length} total={clients.length} color="#10b981" />
          <Bar label="VIP" value={clients.filter((client) => client.status === "vip").length} total={clients.length} color="#6366f1" />
          <Bar label="Prospects" value={clients.filter((client) => client.status === "prospect").length} total={clients.length} color="#f59e0b" />
          <Bar label="Inactifs" value={clients.filter((client) => client.status === "inactive").length} total={clients.length} color="#94a3b8" />
        </section>
      </div>

      <section className="dashboard-card bi-summary">
        <div className="card-heading"><div><h3>Synthèse par département</h3><p>Répartition de l'effectif actif</p></div></div>
        <div className="bi-department-grid">
          {[...new Set(employees.map((employee) => employee.department))].map((department) => (
            <div className="bi-department" key={department}><span>{department}</span><strong>{employees.filter((employee) => employee.department === department && employee.status === "active").length}</strong></div>
          ))}
        </div>
      </section>
    </div>
  );
}