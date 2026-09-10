export type UserRole = "admin" | "manager" | "user" | "super_manager" | "ceo";

export interface AuthUser {
  id: number | string;
  username: string;
  password: string;
  role: UserRole;
  employeeId: number | string | null;
  companyId?: number | string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
