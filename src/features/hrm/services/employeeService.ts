import type {
  Attendance,
  Employee,
  LeaveRequest,
  Team,
} from "../types/employee.types";

const API_URL = "http://localhost:3000";

/* =========================================================
   EMPLOYEES
========================================================= */

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${API_URL}/employees`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les employés");
  }

  return response.json();
}

export async function getEmployee(id: number): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`);

  if (!response.ok) {
    throw new Error("Employé introuvable");
  }

  return response.json();
}

export async function createEmployee(
  employee: Omit<Employee, "id">,
): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error("Impossible de créer l'employé");
  }

  return response.json();
}

export async function updateEmployee(
  id: number,
  employee: Partial<Employee>,
): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error("Impossible de modifier l'employé");
  }

  return response.json();
}

export async function deleteEmployee(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer l'employé");
  }
}

/* =========================================================
   TEAMS
========================================================= */

export async function getTeams(): Promise<Team[]> {
  const response = await fetch(`${API_URL}/teams`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les équipes");
  }

  return response.json();
}

/* =========================================================
   LEAVES
========================================================= */

export async function getLeaves(): Promise<LeaveRequest[]> {
  const response = await fetch(`${API_URL}/leaves`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les congés");
  }

  return response.json();
}

export async function updateLeaveStatus(
  id: number | string,
  status: "approved" | "rejected",
): Promise<LeaveRequest> {
  const response = await fetch(`${API_URL}/leaves/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Impossible de modifier le statut du congé");
  }

  return response.json();
}

export async function createLeave(
  leave: Omit<LeaveRequest, "id">,
): Promise<LeaveRequest> {
  const response = await fetch(`${API_URL}/leaves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leave),
  });

  if (!response.ok) {
    throw new Error("Impossible de créer la demande de congé");
  }

  return response.json();
}

/* =========================================================
   ATTENDANCE
========================================================= */

export async function getAttendance(): Promise<Attendance[]> {
  const response = await fetch(`${API_URL}/attendance`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les présences");
  }

  return response.json();
}
