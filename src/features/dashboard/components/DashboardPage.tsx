import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../auth/store/authStore";
import type { AuthUser } from "../../auth/types/auth.types";
import { useCRM } from "../../crm/hooks/useCRM";
import { getEmployee } from "../../hrm/services/employeeService";
import { useEmployees } from "../../hrm/hooks/useEmployees";
import { useProjects } from "../../pms/hooks/useProjects";

interface DashboardProduct {
  companyId: string;
  stock: number;
}

interface DashboardCartsResponse {
  carts: unknown[];
}

interface WeatherResponse {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    precipitation_probability_max: number[];
  };
}

async function getERPOverview(user: AuthUser | null) {
  const [productsResponse, cartsResponse] = await Promise.all([
    fetch("http://localhost:3000/products"),
    fetch("https://dummyjson.com/carts?limit=100"),
  ]);

  if (!productsResponse.ok || !cartsResponse.ok) {
    throw new Error("Impossible de charger les indicateurs ERP.");
  }

  const productsData: DashboardProduct[] = await productsResponse.json();
  const cartsData: DashboardCartsResponse = await cartsResponse.json();
  let companyId = user?.companyId ? String(user.companyId) : undefined;

  if (
    !companyId &&
    user?.employeeId &&
    user.role !== "admin" &&
    user.role !== "super_manager" &&
    !Number.isNaN(Number(user.employeeId))
  ) {
    const employee = await getEmployee(Number(user.employeeId));
    companyId = employee.companyId ? String(employee.companyId) : undefined;
  }

  return {
    products: companyId
      ? productsData.filter((product) => product.companyId === companyId)
      : productsData,
    orders: cartsData.carts,
  };
}

async function getWeather(): Promise<WeatherResponse> {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,precipitation_probability_max&forecast_days=5&timezone=Europe%2FParis",
  );

  if (!response.ok) {
    throw new Error("Impossible de charger la météo.");
  }

  return response.json();
}

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
  const { user } = useAuthStore();
  const projectsQuery = useProjects();
  const employeesQuery = useEmployees();
  const crm = useCRM();
  const erpQuery = useQuery({
    queryKey: ["erp-overview", user?.id, user?.companyId, user?.employeeId],
    queryFn: () => getERPOverview(user),
    staleTime: 5 * 60 * 1000,
  });
  const weatherQuery = useQuery({
    queryKey: ["weather", "paris"],
    queryFn: getWeather,
    staleTime: 15 * 60 * 1000,
  });

  const projects = projectsQuery.data ?? [];
  const employees = employeesQuery.data ?? [];
  const clients = crm.clients;
  const erpProducts = erpQuery.data?.products ?? [];
  const erpOrders = erpQuery.data?.orders ?? [];
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
    projectsQuery.isLoading || employeesQuery.isLoading || crm.loading || erpQuery.isLoading;
  const hasError = projectsQuery.isError || employeesQuery.isError || Boolean(crm.error) || erpQuery.isError;
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
          <div className="erp-overview">
            <div className="inventory-stat"><span>Produits</span><strong>{erpProducts.length}</strong></div>
            <div className="inventory-stat"><span>Unités en stock</span><strong>{erpProducts.reduce((sum, product) => sum + product.stock, 0)}</strong></div>
            <div className="inventory-stat"><span>Stock faible</span><strong className="warning-text">{erpProducts.filter((product) => product.stock > 0 && product.stock < 10).length}</strong></div>
            <div className="inventory-stat"><span>Commandes</span><strong>{erpOrders.length}</strong></div>
          </div>
        </section>
      </div>

      <div className="dashboard-grid analytics-grid">
        <section className="dashboard-card dashboard-card-large">
          <div className="card-heading">
            <div><h3>Analyse de progression</h3><p>Comparaison des projets actifs</p></div>
            <span className="card-counter">{activeProjects.length} actifs</span>
          </div>
          <div className="project-chart">
            {projects.slice(0, 6).map((project) => (
              <div className="project-chart-item" key={project.id}>
                <div className="project-chart-value" style={{ height: `${Math.max(project.progress, 6)}%` }}><span>{project.progress}%</span></div>
                <small>{project.title}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card weather-card">
          <div className="card-heading"><div><h3>Météo</h3><p>Paris · prévisions sur 5 jours</p></div><span className="weather-symbol">☼</span></div>
          {weatherQuery.isLoading ? <div className="dashboard-loading">Chargement de la météo...</div> : weatherQuery.isError ? (
            <div className="compact-empty"><strong>Météo indisponible</strong><p>Les indicateurs principaux restent accessibles.</p></div>
          ) : weatherQuery.data ? (
            <>
              <div className="weather-current"><strong>{Math.round(weatherQuery.data.current.temperature_2m)}°C</strong><span>{weatherLabel(weatherQuery.data.current.weather_code)} · Vent {Math.round(weatherQuery.data.current.wind_speed_10m)} km/h</span></div>
              <div className="weather-forecast">
                {weatherQuery.data.daily.time.map((day, index) => (
                  <div className="weather-day" key={day}><small>{new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(new Date(day))}</small><strong>{Math.round(weatherQuery.data!.daily.temperature_2m_max[index])}°</strong><span>{Math.round(weatherQuery.data!.daily.precipitation_probability_max[index])}% pluie</span></div>
                ))}
              </div>
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function weatherLabel(code: number) {
  if (code === 0) return "Ciel dégagé";
  if (code <= 3) return "Nuageux";
  if (code <= 67) return "Pluie";
  if (code <= 77) return "Neige";
  return "Averses";
}