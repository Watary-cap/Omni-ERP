import { useMemo, useState } from "react";

import {
  useDeleteProject,
  useProjects,
} from "../hooks/useProjects";

import type {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "../types/project.types";

import ProjectFormModal from "./ProjectFormModal";
import ProjectKanban from "./ProjectKanban";

export default function ProjectsPage() {
  const projectsQuery = useProjects();
  const deleteProjectMutation = useDeleteProject();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [kanbanProject, setKanbanProject] =
    useState<Project | null>(null);

  const projects = useMemo(
    () => projectsQuery.data ?? [],
    [projectsQuery.data],
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch =
        project.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        project.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        status === "" ||
        project.status === status;

      const matchPriority =
        priority === "" ||
        project.priority === priority;

      return (
        matchSearch &&
        matchStatus &&
        matchPriority
      );
    });
  }, [
    projects,
    search,
    status,
    priority,
  ]);

  function getStatusLabel(
    projectStatus: ProjectStatus,
  ) {
    switch (projectStatus) {
      case "planned":
        return "Planifié";

      case "in_progress":
        return "En cours";

      case "on_hold":
        return "En pause";

      case "completed":
        return "Terminé";

      default:
        return projectStatus;
    }
  }

  function getPriorityLabel(
    projectPriority: ProjectPriority,
  ) {
    switch (projectPriority) {
      case "low":
        return "Faible";

      case "medium":
        return "Moyenne";

      case "high":
        return "Haute";

      case "critical":
        return "Critique";

      default:
        return projectPriority;
    }
  }

  function handleDelete(id: string) {
    const confirmation =
      window.confirm(
        "Voulez-vous vraiment supprimer ce projet ?",
      );

    if (!confirmation) {
      return;
    }

    deleteProjectMutation.mutate(id);
  }

  function openEditModal(project: Project) {
    setSelectedProject(project);
  }

  function closeModal() {
    setIsCreateModalOpen(false);
    setSelectedProject(null);
  }

  /*
    Si un projet est ouvert dans le Kanban,
    on affiche directement son tableau de tâches.
  */
  if (kanbanProject) {
    return (
      <ProjectKanban
        projectId={kanbanProject.id}
        projectTitle={kanbanProject.title}
        onClose={() =>
          setKanbanProject(null)
        }
      />
    );
  }

  if (projectsQuery.isLoading) {
    return (
      <div className="dashboard">
        <h1>Gestion des projets</h1>

        <p>
          Chargement des projets...
        </p>
      </div>
    );
  }

  if (projectsQuery.isError) {
    return (
      <div className="dashboard">
        <h1>Gestion des projets</h1>

        <div className="dashboard-card">
          <h2>Erreur</h2>

          <p>
            Impossible de charger les projets.
          </p>

          <p>
            Vérifie que JSON Server est lancé
            avec :
          </p>

          <code>
            npm run server
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-heading">
        <div>
          <span className="welcome-label">
            PROJECT MANAGEMENT SYSTEM
          </span>

          <h1>
            Gestion des projets
          </h1>

          <p>
            Gérez les projets, leurs priorités,
            leur avancement, leurs tâches
            et leurs échéances.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setIsCreateModalOpen(true)
          }
        >
          + Nouveau projet
        </button>
      </div>

      {/* FILTRES */}
      <div
        className="dashboard-card"
        style={{
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* RECHERCHE */}
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            style={{
              padding: "10px 12px",
              border:
                "1px solid #e2e8f0",
              borderRadius: "8px",
              minWidth: "250px",
            }}
          />

          {/* FILTRE STATUT */}
          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value,
              )
            }
            style={{
              padding: "10px 12px",
              border:
                "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <option value="">
              Tous les statuts
            </option>

            <option value="planned">
              Planifié
            </option>

            <option value="in_progress">
              En cours
            </option>

            <option value="on_hold">
              En pause
            </option>

            <option value="completed">
              Terminé
            </option>
          </select>

          {/* FILTRE PRIORITÉ */}
          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value,
              )
            }
            style={{
              padding: "10px 12px",
              border:
                "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <option value="">
              Toutes les priorités
            </option>

            <option value="low">
              Faible
            </option>

            <option value="medium">
              Moyenne
            </option>

            <option value="high">
              Haute
            </option>

            <option value="critical">
              Critique
            </option>
          </select>
        </div>
      </div>

      {/* NOMBRE DE PROJETS */}
      <p
        style={{
          marginBottom: "16px",
          color: "#64748b",
        }}
      >
        {filteredProjects.length} projet
        {filteredProjects.length !== 1
          ? "s"
          : ""}
      </p>

      {/* LISTE DES PROJETS */}
      <div className="dashboard-grid">
        {filteredProjects.map(
          (project) => (
            <div
              className="dashboard-card"
              key={project.id}
            >
              {/* TITRE */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h3>
                    {project.title}
                  </h3>

                  <p
                    style={{
                      color: "#64748b",
                      marginTop: "6px",
                    }}
                  >
                    {
                      project.description
                    }
                  </p>
                </div>
              </div>

              {/* STATUT ET PRIORITÉ */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    background:
                      "#eef2ff",
                    color:
                      "#4338ca",
                    padding:
                      "6px 10px",
                    borderRadius:
                      "20px",
                    fontSize: "12px",
                  }}
                >
                  {getStatusLabel(
                    project.status,
                  )}
                </span>

                <span
                  style={{
                    background:
                      project.priority ===
                      "critical"
                        ? "#fee2e2"
                        : project.priority ===
                            "high"
                          ? "#ffedd5"
                          : "#fef3c7",

                    color:
                      project.priority ===
                      "critical"
                        ? "#dc2626"
                        : project.priority ===
                            "high"
                          ? "#c2410c"
                          : "#92400e",

                    padding:
                      "6px 10px",
                    borderRadius:
                      "20px",
                    fontSize: "12px",
                  }}
                >
                  {getPriorityLabel(
                    project.priority,
                  )}
                </span>
              </div>

              {/* MANAGER */}
              <div
                style={{
                  marginBottom: "16px",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                Responsable :{" "}
                <strong>
                  {project.managerId}
                </strong>
              </div>

              {/* PROGRESSION */}
              <div
                style={{
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span>
                    Progression
                  </span>

                  <strong>
                    {project.progress}%
                  </strong>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background:
                      "#e2e8f0",
                    borderRadius:
                      "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${project.progress}%`,
                      height: "100%",
                      background:
                        project.progress ===
                        100
                          ? "#22c55e"
                          : "#6366f1",

                      borderRadius:
                        "10px",
                    }}
                  />
                </div>
              </div>

              {/* DATES */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  fontSize: "13px",
                  color: "#64748b",
                  marginBottom: "20px",
                }}
              >
                <span>
                  Début :{" "}
                  {project.startDate}
                </span>

                <span>
                  Fin :{" "}
                  {project.endDate}
                </span>
              </div>

              {/* ACTIONS */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {/* TÂCHES */}
                <button
                  type="button"
                  onClick={() =>
                    setKanbanProject(
                      project,
                    )
                  }
                  style={{
                    flex: 1,
                    minWidth: "90px",
                    border: 0,
                    background:
                      "#dcfce7",
                    color: "#15803d",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Tâches
                </button>

                {/* MODIFIER */}
                <button
                  type="button"
                  onClick={() =>
                    openEditModal(
                      project,
                    )
                  }
                  style={{
                    flex: 1,
                    minWidth: "90px",
                    border: 0,
                    background:
                      "#eef2ff",
                    color: "#4f46e5",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Modifier
                </button>

                {/* SUPPRIMER */}
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      project.id,
                    )
                  }
                  disabled={
                    deleteProjectMutation.isPending
                  }
                  style={{
                    flex: 1,
                    minWidth: "90px",
                    border: 0,
                    background:
                      "#fee2e2",
                    color: "#dc2626",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {/* AUCUN PROJET */}
      {filteredProjects.length ===
        0 && (
        <div className="dashboard-card">
          <h3>
            Aucun projet
          </h3>

          <p>
            Aucun projet ne correspond
            à votre recherche ou aux
            filtres sélectionnés.
          </p>
        </div>
      )}

      {/* MODAL CRÉATION */}
      {isCreateModalOpen && (
        <ProjectFormModal
          onClose={closeModal}
        />
      )}

      {/* MODAL MODIFICATION */}
      {selectedProject && (
        <ProjectFormModal
          project={selectedProject}
          onClose={closeModal}
        />
      )}
    </div>
  );
}