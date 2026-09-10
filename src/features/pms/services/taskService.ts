import type { Task } from "../types/task.types";

const API_URL = "http://localhost:3000/tasks";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      "Impossible de récupérer les tâches",
    );
  }

  return response.json();
}

export async function createTask(
  task: Omit<Task, "id">,
): Promise<Task> {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error(
      "Impossible de créer la tâche",
    );
  }

  return response.json();
}

export async function updateTask(
  task: Task,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/${task.id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(task),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de modifier la tâche",
    );
  }

  return response.json();
}

export async function deleteTask(
  id: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de supprimer la tâche",
    );
  }
}