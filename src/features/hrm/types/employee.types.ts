export type EmployeeStatus = "active" | "inactive";

export type LeaveStatus = "pending" | "approved" | "rejected";

export type AttendanceStatus = "present" | "absent" | "remote" | "late";

export interface Skill {
  id: number;
  name: string;
  level: number;
}

export interface Team {
  id: number | string;
  name: string;
  managerId: number | string | null;
}

export interface Employee {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  teamId: number | string | null;
  managerId: number | string | null;
  status: EmployeeStatus;
  hireDate: string;
  location: string;
  avatar: string;
  skills: Skill[];
  companyId?: number | string;
}

export interface LeaveRequest {
  id: number | string;
  employeeId: number | string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
}

export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  status: AttendanceStatus;
  arrival: string | null;
  departure: string | null;
}
