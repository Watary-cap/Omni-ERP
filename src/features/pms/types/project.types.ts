export type ProjectStatus =
  | "planned"
  | "in_progress"
  | "on_hold"
  | "completed";

export type ProjectPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  managerId: string;
  startDate: string;
  endDate: string;
  progress: number;
}