import type { Project } from "../types/project.types";

const API_URL = "http://localhost:3000/projects";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les projets");
  }

  return response.json();
}

export async function createProject(
  project: Omit<Project, "id">,
): Promise<Project> {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error("Impossible de créer le projet");
  }

  return response.json();
}

export async function updateProject(project: Project): Promise<Project> {
  const response = await fetch(`${API_URL}/${project.id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error("Impossible de modifier le projet");
  }

  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer le projet");
  }
}