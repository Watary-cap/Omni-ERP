import type { Client } from "../serices/crmService";

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

export default function ClientCard({ client, onClick }: ClientCardProps) {
  const initials = client.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "20px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(event) => {
        if (onClick) {
          event.currentTarget.style.borderColor = "#5965f2";
          event.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor = "var(--border)";
        event.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "12px",
            background: "var(--accent-tint)",
            color: "#5965f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "15px",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            {client.name}
          </h3>

          {client.company && (
            <p
              style={{
                margin: "4px 0 0",
                color: "var(--text-soft)",
                fontSize: "13px",
              }}
            >
              {client.company}
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "9px",
          fontSize: "13px",
        }}
      >
        {client.email && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-soft)",
            }}
          >
            <span>✉</span>
            <span>{client.email}</span>
          </div>
        )}

        {client.phone && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-soft)",
            }}
          >
            <span>☎</span>
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: "16px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "5px 10px",
            borderRadius: "999px",
            background: client.status === "inactive" ? "#f1f2f4" : "var(--success-tint)",
            color: client.status === "inactive" ? "#777b86" : "#25834d",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {client.status === "inactive" ? "Inactif" : "Actif"}
        </span>
      </div>
    </div>
  );
}
