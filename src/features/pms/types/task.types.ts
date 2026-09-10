export type TaskStatus =
  | "todo"
  | "in_progress"
  | "in_review"
  | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface Task {
  id: string;
  projectId: string;

  title: string;
  description: string;

  status: TaskStatus;
  priority: TaskPriority;

  assigneeId: string;

  estimatedHours: number;

  createdAt: string;
}