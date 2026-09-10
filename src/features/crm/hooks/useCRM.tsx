import { useCallback, useEffect, useState } from "react";

import { useAuthStore } from "../../auth/store/authStore";

import {
  crmService,
  type Client,
  type Company,
  type CRMEmployee,
  type CRMTeam,
  type CEO,
} from "../serices/crmService";

export function useCRM() {
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<CRMEmployee[]>([]);
  const [teams, setTeams] = useState<CRMTeam[]>([]);
  const [ceos, setCEOs] = useState<CEO[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCRM = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const isAdmin = user?.role === "admin";
      const companyId = user?.companyId ? String(user.companyId) : undefined;

      if (!isAdmin && !companyId) {
        throw new Error("Ce compte n'est associé à aucune entreprise.");
      }

      const companiesData = await crmService.getCompanies(
        isAdmin ? undefined : companyId,
      );
      const companyName = companiesData[0]?.name;

      if (!isAdmin && !companyName) {
        throw new Error("Entreprise introuvable pour ce compte.");
      }

      const [allEmployees, allTeams, allCEOs, allClients] = await Promise.all([
        crmService.getEmployees(),
        crmService.getTeams(),
        crmService.getCEOs(),
        crmService.getClients(),
      ]);

      const employeesData = isAdmin
        ? allEmployees
        : allEmployees.filter((employee) => employee.companyId === companyId);
      const teamsData = isAdmin
        ? allTeams
        : allTeams.filter((team) => team.companyId === companyId);
      const ceosData = isAdmin
        ? allCEOs
        : allCEOs.filter((ceo) => ceo.companyId === companyId);
      const clientsData = isAdmin
        ? allClients
        : allClients.filter(
            (client) =>
              client.company?.toLowerCase() === companyName?.toLowerCase(),
          );

      setCompanies(companiesData);
      setEmployees(employeesData);
      setTeams(teamsData);
      setCEOs(ceosData);
      setClients(clientsData);
    } catch (err) {
      console.error("Erreur CRM :", err);

      setError(
        "Impossible de charger les données du CRM. Vérifie que JSON Server est lancé.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCRM();
  }, [loadCRM]);

  return {
    companies,
    employees,
    teams,
    ceos,
    clients,
    loading,
    error,
    reload: loadCRM,
  };
}
