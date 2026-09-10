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
