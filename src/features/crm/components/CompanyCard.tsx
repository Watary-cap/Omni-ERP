import type { Company, CRMEmployee, CRMTeam, CEO } from "../serices/crmService";

interface CompanyCardProps {
  company: Company;
  employees: CRMEmployee[];
  teams: CRMTeam[];
  ceo?: CEO;
  selected?: boolean;
  onClick?: () => void;
}

export default function CompanyCard({
  company,
  employees,
  teams,
  ceo,
  selected = false,
  onClick,
}: CompanyCardProps) {
  const initials = company.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const companyTeams = teams.filter((team) => team.companyId === company.id);

  const managers = companyTeams.filter((team) => team.managerId);

  const companyEmployees = employees.filter(
    (employee) => employee.companyId === company.id,
  );

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--surface)",
        border: selected ? "2px solid #5965f2" : "1px solid var(--border)",
        borderRadius: "16px",
        padding: "22px",
        cursor: onClick ? "pointer" : "default",
        boxShadow: selected
          ? "0 8px 24px rgba(89, 101, 242, 0.12)"
          : "0 3px 12px rgba(30, 34, 45, 0.04)",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#5965f2",
              color: "var(--surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "16px",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                color: "var(--text)",
                fontSize: "17px",
                fontWeight: 700,
              }}
            >
              {company.name}
            </h3>

            <p
              style={{
                margin: "5px 0 0",
                color: "var(--text-soft)",
                fontSize: "13px",
              }}
            >
              {company.legalName || company.industry || "Entreprise"}
            </p>
          </div>
        </div>

        <span
          style={{
            padding: "5px 9px",
            borderRadius: "999px",
            background: "var(--success-tint)",
            color: "#25834d",
            fontSize: "11px",
            fontWeight: 700,
          }}
        >
          Actif
        </span>
      </div>

      {company.description && (
        <p
          style={{
            margin: "18px 0",
            color: "var(--text-soft)",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          {company.description}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginTop: "18px",
        }}
      >
        <Stat label="Collaborateurs" value={companyEmployees.length} />

        <Stat label="Managers" value={managers.length} />

        <Stat label="Équipes" value={teams.length} />
      </div>

      {ceo && (
        <div
          style={{
            marginTop: "18px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-soft)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "var(--accent-tint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
            }}
          >
            👤
          </div>

          <div>
            <p
              style={{
                margin: 0,
                color: "var(--text-muted)",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Chef d'entreprise
            </p>

            <p
              style={{
                margin: "3px 0 0",
                color: "var(--text-strong)",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {ceo.firstName} {ceo.lastName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatProps {
  label: string;
  value: number;
}

function Stat({ label, value }: StatProps) {
  return (
    <div
      style={{
        background: "var(--surface-muted)",
        borderRadius: "10px",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "var(--text)",
          fontSize: "18px",
          fontWeight: 800,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "var(--text-muted)",
          fontSize: "10px",
          marginTop: "3px",
        }}
      >
        {label}
      </div>
    </div>
  );
}
