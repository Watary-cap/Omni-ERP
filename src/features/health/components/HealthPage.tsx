import { useQuery } from "@tanstack/react-query";

interface ServiceStatus {
  name: string;
  url: string;
  status: "ok" | "warning" | "error";
  latency?: number;
  message: string;
}

const services = [
  { name: "JSON Server", url: "http://localhost:3000/projects" },
  { name: "DummyJSON", url: "https://dummyjson.com/products?limit=1" },
  { name: "Open-Meteo", url: "https://api.open-meteo.com/v1/forecast?latitude=48.8&longitude=2.3&current=temperature_2m" },
];

async function checkService(service: (typeof services)[number]): Promise<ServiceStatus> {
  const started = performance.now();
  try {
    const response = await fetch(service.url);
    const latency = Math.round(performance.now() - started);
    return {
      ...service,
      latency,
      status: response.ok ? (latency > 1200 ? "warning" : "ok") : "error",
      message: response.ok ? "Disponible" : `HTTP ${response.status}`,
    };
  } catch {
    return { ...service, status: "error", message: "Indisponible" };
  }
}

async function getHealth(): Promise<ServiceStatus[]> {
  return Promise.all(services.map(checkService));
}

export default function HealthPage() {
  const healthQuery = useQuery({
    queryKey: ["health-checks"],
    queryFn: getHealth,
    staleTime: 30_000,
  });
  const statuses = healthQuery.data ?? [];
  const hasError = statuses.some((service) => service.status === "error");

  return (
    <div className="dashboard health-page">
      <div className="dashboard-heading">
        <div><h1>Health checks</h1><p>Disponibilité des services utilisés par Omni-ERP.</p></div>
        <button className="primary-button" onClick={() => void healthQuery.refetch()}>↻ Vérifier</button>
      </div>
      <div className={`health-summary ${hasError ? "error" : "ok"}`}>
        <strong>{healthQuery.isFetching ? "Vérification en cours..." : hasError ? "Des services sont indisponibles" : "Tous les services répondent"}</strong>
        <span>Dernière vérification : {new Date().toLocaleTimeString("fr-FR")}</span>
      </div>
      <div className="health-grid">
        {statuses.map((service) => (
          <article className="dashboard-card health-card" key={service.name}>
            <div className={`health-dot ${service.status}`} />
            <div><h3>{service.name}</h3><p>{service.message}</p></div>
            <strong>{service.latency ? `${service.latency} ms` : "—"}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
