import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import ClientCard from "./ClientCard";
import CompanyCard from "./CompanyCard";

import { useCRM } from "../hooks/useCRM";

import type { CRMEmployee, CRMTeam } from "../serices/crmService";

export default function ClientsPage() {
  const { companies, employees, teams, ceos, clients, loading, error, reload } =
    useCRM();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );

  const [search, setSearch] = useState("");

  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) {
      return companies[0];
    }

    return companies.find((company) => company.id === selectedCompanyId);
  }, [companies, selectedCompanyId]);

  const companyEmployees = useMemo(() => {
    if (!selectedCompany) {
      return [];
    }

    return employees.filter(
      (employee) => employee.companyId === selectedCompany.id,
    );
  }, [employees, selectedCompany]);

  const companyTeams = useMemo(() => {
    if (!selectedCompany) {
      return [];
    }

    return teams.filter((team) => team.companyId === selectedCompany.id);
  }, [teams, selectedCompany]);

  const companyCEO = useMemo(() => {
    if (!selectedCompany) {
      return undefined;
    }

    return ceos.find((ceo) => ceo.companyId === selectedCompany.id);
  }, [ceos, selectedCompany]);

  const companyClients = useMemo(() => {
    if (!selectedCompany) {
      return clients;
    }

    const filtered = clients.filter(
      (client) =>
        client.company?.toLowerCase() === selectedCompany.name.toLowerCase(),
    );

    return filtered;
  }, [clients, selectedCompany]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return companyEmployees;
    }

    return companyEmployees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();

      return (
        fullName.includes(query) ||
        employee.email?.toLowerCase().includes(query) ||
        employee.jobTitle?.toLowerCase().includes(query)
      );
    });
  }, [companyEmployees, search]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>↻</div>

          <h2 style={styles.loadingTitle}>Chargement du CRM...</h2>

          <p style={styles.loadingText}>
            Récupération des entreprises et des collaborateurs.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>!</div>

          <h2 style={styles.errorTitle}>Impossible de charger le CRM</h2>

          <p style={styles.errorText}>{error}</p>

          <button type="button" onClick={reload} style={styles.primaryButton}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>
            <span>Accueil</span>
            <span>›</span>
            <span style={styles.breadcrumbActive}>CRM</span>
          </div>

          <h1 style={styles.title}>CRM</h1>

          <p style={styles.subtitle}>
            Gestion des entreprises, clients et collaborateurs
          </p>
        </div>

        <button type="button" onClick={reload} style={styles.refreshButton}>
          ↻ Actualiser
        </button>
      </div>

      {/* STATISTIQUES */}
      <div style={styles.statsGrid}>
        <StatCard icon="🏢" label="Entreprises" value={companies.length} />

        <StatCard icon="👥" label="Collaborateurs" value={employees.length} />

        <StatCard
          icon="👔"
          label="Managers"
          value={teams.filter((team) => team.managerId).length}
        />

        <StatCard icon="🤝" label="Clients" value={clients.length} />
      </div>

      {/* ENTREPRISES */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Entreprises</h2>

            <p style={styles.sectionSubtitle}>
              Vue d'ensemble des entreprises du groupe
            </p>
          </div>
        </div>

        {companies.length === 0 ? (
          <EmptyState text="Aucune entreprise trouvée." />
        ) : (
          <div style={styles.companyGrid}>
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                employees={employees}
                teams={teams.filter((team) => team.companyId === company.id)}
                ceo={ceos.find((ceo) => ceo.companyId === company.id)}
                selected={selectedCompany?.id === company.id}
                onClick={() => {
                  setSelectedCompanyId(company.id);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* DETAIL ENTREPRISE */}
      {selectedCompany && (
        <section style={styles.detailSection}>
          <div style={styles.detailHeader}>
            <div>
              <div style={styles.detailLabel}>ENTREPRISE SÉLECTIONNÉE</div>

              <h2 style={styles.detailTitle}>{selectedCompany.name}</h2>

              <p style={styles.detailSubtitle}>
                {selectedCompany.industry || "Entreprise"}
                {selectedCompany.city ? ` • ${selectedCompany.city}` : ""}
              </p>
            </div>

            {companyCEO && (
              <div style={styles.ceoBox}>
                <div style={styles.ceoAvatar}>
                  {companyCEO.firstName.charAt(0)}
                  {companyCEO.lastName.charAt(0)}
                </div>

                <div>
                  <div style={styles.ceoLabel}>CHEF D'ENTREPRISE</div>

                  <div style={styles.ceoName}>
                    {companyCEO.firstName} {companyCEO.lastName}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTACT ENTREPRISE */}
          <div style={styles.companyInfoGrid}>
            <InfoItem
              label="Raison sociale"
              value={selectedCompany.legalName || selectedCompany.name}
            />

            <InfoItem
              label="Secteur"
              value={selectedCompany.industry || "Non renseigné"}
            />

            <InfoItem
              label="Ville"
              value={selectedCompany.city || "Non renseignée"}
            />

            <InfoItem
              label="Email"
              value={selectedCompany.email || "Non renseigné"}
            />

            <InfoItem
              label="Téléphone"
              value={selectedCompany.phone || "Non renseigné"}
            />
          </div>

          {/* EQUIPES */}
          <div style={styles.subSection}>
            <div style={styles.subSectionHeader}>
              <div>
                <h3 style={styles.subSectionTitle}>Organisation</h3>

                <p style={styles.subSectionSubtitle}>
                  Équipes et responsables de l'entreprise
                </p>
              </div>

              <span style={styles.countBadge}>
                {companyTeams.length} équipes
              </span>
            </div>

            {companyTeams.length === 0 ? (
              <EmptyState text="Aucune équipe trouvée." />
            ) : (
              <div style={styles.teamGrid}>
                {companyTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    employees={companyEmployees}
                  />
                ))}
              </div>
            )}
          </div>

          {/* COLLABORATEURS */}
          <div style={styles.subSection}>
            <div style={styles.subSectionHeader}>
              <div>
                <h3 style={styles.subSectionTitle}>Collaborateurs</h3>

                <p style={styles.subSectionSubtitle}>
                  Managers et salariés de l'entreprise
                </p>
              </div>

              <span style={styles.countBadge}>{companyEmployees.length}</span>
            </div>

            <div style={styles.searchContainer}>
              <span style={styles.searchIcon}>⌕</span>

              <input
                type="text"
                placeholder="Rechercher un collaborateur..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={styles.searchInput}
              />
            </div>

            {filteredEmployees.length === 0 ? (
              <EmptyState text="Aucun collaborateur trouvé." />
            ) : (
              <div style={styles.employeeTable}>
                <div style={styles.tableHeader}>
                  <span>Collaborateur</span>
                  <span>Poste</span>
                  <span>Équipe</span>
                  <span>Rôle</span>
                </div>

                {filteredEmployees.map((employee) => (
                  <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    teams={companyTeams}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CLIENTS */}
          <div style={styles.subSection}>
            <div style={styles.subSectionHeader}>
              <div>
                <h3 style={styles.subSectionTitle}>Clients</h3>

                <p style={styles.subSectionSubtitle}>
                  Contacts et entreprises clientes
                </p>
              </div>

              <span style={styles.countBadge}>{companyClients.length}</span>
            </div>

            {companyClients.length === 0 ? (
              <EmptyState text="Aucun client trouvé." />
            ) : (
              <div style={styles.clientGrid}>
                {companyClients.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>

      <div>
        <div style={styles.statValue}>{value}</div>

        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

/* =========================================================
   TEAM CARD
========================================================= */

interface TeamCardProps {
  team: CRMTeam;
  employees: CRMEmployee[];
}

function TeamCard({ team, employees }: TeamCardProps) {
  const manager = employees.find((employee) => employee.id === team.managerId);

  const teamEmployees = employees.filter(
    (employee) => employee.teamId === team.id && employee.role !== "manager",
  );

  const icons: Record<string, string> = {
    RH: "👥",
    Technologie: "💻",
    Commercial: "📈",
  };

  return (
    <div style={styles.teamCard}>
      <div style={styles.teamIcon}>{icons[team.name] || "🏢"}</div>

      <div style={{ flex: 1 }}>
        <h4 style={styles.teamName}>{team.name}</h4>

        {manager && (
          <p style={styles.teamManager}>
            Manager :{" "}
            <strong>
              {manager.firstName} {manager.lastName}
            </strong>
          </p>
        )}

        <div style={styles.teamEmployees}>
          {teamEmployees.length} salarié
          {teamEmployees.length > 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPLOYEE ROW
========================================================= */

interface EmployeeRowProps {
  employee: CRMEmployee;
  teams: CRMTeam[];
}

function EmployeeRow({ employee, teams }: EmployeeRowProps) {
  const team = teams.find((item) => item.id === employee.teamId);

  const initials = employee.firstName.charAt(0) + employee.lastName.charAt(0);

  const normalizedRole = employee.role?.toLowerCase() || "";
  const normalizedJobTitle = employee.jobTitle?.toLowerCase() || "";

  const isCEO = normalizedRole === "ceo" || normalizedJobTitle.includes("ceo");

  const isSuperManager =
    normalizedRole === "super_manager" ||
    normalizedRole === "super manager" ||
    normalizedJobTitle.includes("super manager");

  const isManager =
    normalizedRole === "manager" || normalizedJobTitle.includes("manager");

  return (
    <div style={styles.employeeRow}>
      <div style={styles.employeeIdentity}>
        <div style={styles.employeeAvatar}>{initials}</div>

        <div>
          <div style={styles.employeeName}>
            {employee.firstName} {employee.lastName}
          </div>

          {employee.email && (
            <div style={styles.employeeEmail}>{employee.email}</div>
          )}
        </div>
      </div>

      <div style={styles.employeeJob}>{employee.jobTitle}</div>

      <div style={styles.employeeTeam}>{team?.name || "—"}</div>

      <div>
        <span
          style={{
            ...styles.roleBadge,
            ...(isCEO
              ? styles.ceoBadge
              : isSuperManager
                ? styles.superManagerBadge
                : isManager
                  ? styles.managerBadge
                  : styles.userBadge),
          }}
        >
          {isCEO
            ? "CEO"
            : isSuperManager
              ? "Super Manager"
              : isManager
                ? "Manager"
                : "Salarié"}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoLabel}>{label}</div>

      <div style={styles.infoValue}>{value}</div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ text }: { text: string }) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>○</div>

      <p>{text}</p>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100%",
    background: "var(--surface-muted)",
    padding: "30px",
    boxSizing: "border-box",
    color: "var(--text)",
  },

  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "28px",
  },

  breadcrumb: {
    display: "flex",
    gap: "8px",
    color: "var(--text-muted)",
    fontSize: "12px",
    marginBottom: "10px",
  },

  breadcrumbActive: {
    color: "#5965f2",
    fontWeight: 600,
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#7d818d",
    fontSize: "14px",
  },

  refreshButton: {
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "#4f5562",
    borderRadius: "10px",
    padding: "10px 15px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },

  ceoBadge: {
    background: "var(--warning-tint)",
    color: "#c86625",
  },

  superManagerBadge: {
    background: "var(--accent-tint)",
    color: "#7652c7",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "30px",
  },

  statCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  statIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "var(--accent-tint)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statValue: {
    fontSize: "22px",
    fontWeight: 800,
    color: "var(--text)",
  },

  statLabel: {
    fontSize: "12px",
    color: "var(--text-muted)",
    marginTop: "2px",
  },

  section: {
    marginBottom: "28px",
  },

  sectionHeader: {
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 750,
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "var(--text-muted)",
    fontSize: "13px",
  },

  companyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },

  detailSection: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 4px 18px rgba(30, 34, 45, 0.04)",
  },

  detailHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    paddingBottom: "22px",
    borderBottom: "1px solid var(--border-soft)",
  },

  detailLabel: {
    color: "#5965f2",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.8px",
    marginBottom: "6px",
  },

  detailTitle: {
    margin: 0,
    fontSize: "23px",
    fontWeight: 800,
  },

  detailSubtitle: {
    margin: "5px 0 0",
    color: "var(--text-muted)",
    fontSize: "13px",
  },

  ceoBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 15px",
    background: "var(--accent-tint)",
    borderRadius: "12px",
  },

  ceoAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    background: "#5965f2",
    color: "var(--surface)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 800,
  },

  ceoLabel: {
    color: "var(--text-muted)",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.5px",
  },

  ceoName: {
    color: "var(--text-strong)",
    fontSize: "13px",
    fontWeight: 700,
    marginTop: "3px",
  },

  companyInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginTop: "22px",
  },

  infoItem: {
    background: "var(--surface-muted)",
    borderRadius: "11px",
    padding: "12px 14px",
  },

  infoLabel: {
    color: "var(--text-muted)",
    fontSize: "10px",
    fontWeight: 700,
    marginBottom: "5px",
  },

  infoValue: {
    color: "var(--text-strong)",
    fontSize: "12px",
    fontWeight: 600,
    overflowWrap: "anywhere",
  },

  subSection: {
    marginTop: "30px",
  },

  subSectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "15px",
  },

  subSectionTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 750,
  },

  subSectionSubtitle: {
    margin: "4px 0 0",
    color: "var(--text-muted)",
    fontSize: "12px",
  },

  countBadge: {
    background: "var(--accent-tint)",
    color: "#5965f2",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "11px",
    fontWeight: 700,
  },

  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },

  teamCard: {
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },

  teamIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "var(--accent-tint)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    flexShrink: 0,
  },

  teamName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
  },

  teamManager: {
    margin: "5px 0 0",
    color: "var(--text-muted)",
    fontSize: "11px",
  },

  teamEmployees: {
    marginTop: "8px",
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "var(--surface-muted)",
    color: "#6d7280",
    fontSize: "10px",
    fontWeight: 600,
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "0 12px",
    height: "42px",
    marginBottom: "12px",
    background: "var(--surface)",
  },

  searchIcon: {
    color: "var(--text-muted)",
    fontSize: "18px",
  },

  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    height: "100%",
    fontSize: "13px",
    color: "var(--text-strong)",
    background: "transparent",
  },

  employeeTable: {
    border: "1px solid var(--border)",
    borderRadius: "12px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr",
    gap: "15px",
    padding: "11px 15px",
    background: "var(--surface-muted)",
    color: "var(--text-muted)",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
  },

  employeeRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr",
    gap: "15px",
    alignItems: "center",
    padding: "13px 15px",
    borderTop: "1px solid var(--border-soft)",
    fontSize: "12px",
  },

  employeeIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },

  employeeAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "var(--accent-tint)",
    color: "#5965f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 800,
    flexShrink: 0,
  },

  employeeName: {
    color: "var(--text-strong)",
    fontWeight: 700,
  },

  employeeEmail: {
    color: "#999da8",
    fontSize: "10px",
    marginTop: "3px",
    overflowWrap: "anywhere",
  },

  employeeJob: {
    color: "var(--text-soft)",
  },

  employeeTeam: {
    color: "var(--text-soft)",
  },

  roleBadge: {
    display: "inline-flex",
    padding: "5px 8px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: 700,
  },

  managerBadge: {
    background: "var(--accent-tint)",
    color: "#6650c8",
  },

  userBadge: {
    background: "var(--info-tint)",
    color: "#3975a8",
  },

  clientGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
  },

  emptyState: {
    padding: "35px 20px",
    textAlign: "center",
    border: "1px dashed #dfe2e9",
    borderRadius: "12px",
    color: "var(--text-muted)",
    fontSize: "13px",
  },

  emptyIcon: {
    fontSize: "28px",
    marginBottom: "8px",
    color: "#b3b7c1",
  },

  loadingCard: {
    maxWidth: "450px",
    margin: "80px auto",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
  },

  loadingIcon: {
    fontSize: "30px",
    color: "#5965f2",
  },

  loadingTitle: {
    margin: "15px 0 5px",
    fontSize: "18px",
  },

  loadingText: {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: "13px",
  },

  errorCard: {
    maxWidth: "500px",
    margin: "80px auto",
    background: "var(--surface)",
    border: "1px solid #f0dcdc",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
  },

  errorIcon: {
    margin: "0 auto",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "var(--danger-tint)",
    color: "#d04d4d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "20px",
  },

  errorTitle: {
    margin: "15px 0 8px",
    fontSize: "18px",
  },

  errorText: {
    color: "var(--text-muted)",
    fontSize: "13px",
    lineHeight: 1.5,
    marginBottom: "20px",
  },

  primaryButton: {
    border: "none",
    background: "#5965f2",
    color: "var(--surface)",
    borderRadius: "9px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
