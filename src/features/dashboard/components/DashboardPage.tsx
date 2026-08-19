const stats = [
  {
    title: "Projets actifs",
    value: "0",
    change: "0%",
    subtitle: "vs mois dernier",
    icon: "▦",
  },
  {
    title: "Employés",
    value: "0",
    change: "0%",
    subtitle: "0 nouveau",
    icon: "👥",
  },
  {
    title: "Clients actifs",
    value: "0",
    change: "0%",
    subtitle: "vs mois dernier",
    icon: "◉",
  },
  {
    title: "Chiffre d'affaires",
    value: "0 €",
    change: "0%",
    subtitle: "ce mois",
    icon: "↗",
  },
];

export default function DashboardPage() {
  return (
    <div className="dashboard">

      {/* TITRE */}
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Vue générale des performances de GlobalTech Solutions.
          </p>
        </div>

        <button className="primary-button">
          + Nouveau projet
        </button>
      </div>

      {/* KPI */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.title}>

            <div className="stat-card-top">
              <div className="stat-icon">
                {stat.icon}
              </div>

              <span className="stat-change">
                {stat.change}
              </span>
            </div>

            <span className="stat-title">
              {stat.title}
            </span>

            <strong className="stat-value">
              {stat.value}
            </strong>

            <span className="stat-subtitle">
              {stat.subtitle}
            </span>

          </article>
        ))}
      </div>

      {/* GRAPHIQUE + ACTIVITÉS */}
      <div className="dashboard-grid">

        {/* PERFORMANCE */}
        <section className="dashboard-card dashboard-card-large">

          <div className="card-heading">
            <div>
              <h3>Performance</h3>
              <p>Évolution globale de l'activité</p>
            </div>

            <select defaultValue="7">
              <option value="7">
                7 derniers jours
              </option>

              <option value="30">
                30 derniers jours
              </option>

              <option value="year">
                Cette année
              </option>
            </select>
          </div>

          <div className="fake-chart">

            <div className="empty-chart">
              <div className="empty-chart-icon">
                📊
              </div>

              <strong>Aucune donnée disponible</strong>

              <span>
                Les données apparaîtront après
                l'intégration des modules.
              </span>
            </div>

          </div>
        </section>

        {/* ACTIVITÉ */}
        <section className="dashboard-card">

          <div className="card-heading">
            <div>
              <h3>Activité récente</h3>
              <p>Dernières actions</p>
            </div>
          </div>

          <div className="empty-state">

            <div className="empty-state-icon">
              ◷
            </div>

            <strong>Aucune activité récente</strong>

            <p>
              Les nouvelles activités apparaîtront ici.
            </p>

          </div>

        </section>
      </div>

      {/* PROJETS + STOCKS */}
      <div className="dashboard-grid bottom-grid">

        {/* PROJETS */}
        <section className="dashboard-card">

          <div className="card-heading">
            <div>
              <h3>Projets en cours</h3>
              <p>Suivi des principaux projets</p>
            </div>

            <span className="card-counter">
              0 projet
            </span>
          </div>

          <div className="empty-state">

            <div className="empty-state-icon">
              ▦
            </div>

            <strong>Aucun projet en cours</strong>

            <p>
              Les projets actifs apparaîtront ici.
            </p>

          </div>

        </section>

        {/* INVENTAIRE */}
        <section className="dashboard-card">

          <div className="card-heading">
            <div>
              <h3>Résumé des stocks</h3>
              <p>État actuel de l'inventaire</p>
            </div>
          </div>

          <div className="inventory-stat">
            <span>Produits</span>
            <strong>0</strong>
          </div>

          <div className="inventory-stat">
            <span>Stock faible</span>
            <strong className="warning-text">
              0
            </strong>
          </div>

          <div className="inventory-stat">
            <span>Rupture de stock</span>
            <strong className="danger-text">
              0
            </strong>
          </div>

        </section>
      </div>

    </div>
  );
}