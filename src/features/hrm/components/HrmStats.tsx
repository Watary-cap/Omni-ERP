interface HrmStatsProps {
  total: number;
  active: number;
  remote: number;
  pendingLeaves: number;
}

export default function HrmStats({
  total,
  active,
  remote,
  pendingLeaves,
}: HrmStatsProps) {
  const stats = [
    {
      title: "Total employés",
      value: total,
      icon: "👥",
    },
    {
      title: "Employés actifs",
      value: active,
      icon: "✓",
    },
    {
      title: "Télétravail aujourd'hui",
      value: remote,
      icon: "⌂",
    },
    {
      title: "Congés en attente",
      value: pendingLeaves,
      icon: "◷",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.title}>
          <div className="stat-card-top">
            <div className="stat-icon">{stat.icon}</div>

            <span className="stat-change">RH</span>
          </div>

          <span className="stat-title">{stat.title}</span>

          <strong className="stat-value">{stat.value}</strong>

          <span className="stat-subtitle">Données actuelles</span>
        </article>
      ))}
    </div>
  );
}
