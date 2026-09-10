const API_URL = "http://localhost:3000";

async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `Erreur lors du chargement de ${endpoint} (${response.status})`,
    );
  }

  return response.json();
}

export interface Company {
  id: string;
  name: string;
  legalName?: string;
  industry?: string;
  email?: string;
  phone?: string;
  city?: string;
  status?: string;
  description?: string;
}

export interface CRMEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle: string;
  role: string;
  companyId: string;
  teamId?: string;
  managerId?: string;
}

export interface CRMTeam {
  id: string;
  name: string;
  companyId: string;
  managerId?: string;
  superManagerId?: string;
}

export interface CEO {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId: string;
  jobTitle?: string;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export const crmService = {
  getCompanies(companyId?: string): Promise<Company[]> {
    if (companyId) {
      return get<Company>(`/companies/${encodeURIComponent(companyId)}`).then(
        (company) => [company],
      );
    }

    return get<Company[]>("/companies");
  },

  getEmployees(): Promise<CRMEmployee[]> {
    return get<CRMEmployee[]>("/crmEmployees");
  },

  getTeams(): Promise<CRMTeam[]> {
    return get<CRMTeam[]>("/crmTeams");
  },

  getCEOs(): Promise<CEO[]> {
    return get<CEO[]>("/ceos");
  },

  getClients(): Promise<Client[]> {
    return get<Client[]>("/clients");
  },
};
