import { useEffect, useState } from "react";

import {
  useCreateProject,
  useUpdateProject,
} from "../hooks/useProjects";

import type { Project } from "../types/project.types";

interface ProjectFormModalProps {
  onClose: () => void;
  project?: Project | null;
}

export default function ProjectFormModal({
  onClose,
  project,
}: ProjectFormModalProps) {
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const isEditing = Boolean(project);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planned");
  const [priority, setPriority] = useState("medium");
  const [managerId, setManagerId] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setStatus(project.status);
      setPriority(project.priority);
      setManagerId(project.managerId);
      setStartDate(project.startDate);
      setEndDate(project.endDate);
      setProgress(project.progress);
    }
  }, [project]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (isEditing && project) {
      await updateProjectMutation.mutateAsync({
        ...project,
        title,
        description,
        status: status as Project["status"],
        priority: priority as Project["priority"],
        managerId,
        startDate,
        endDate,
        progress,
      });
    } else {
      await createProjectMutation.mutateAsync({
        title,
        description,
        status: status as Project["status"],
        priority: priority as Project["priority"],
        managerId,
        startDate,
        endDate,
        progress: 0,
      });
    }

    onClose();
  }

  const isPending =
    createProjectMutation.isPending ||
    updateProjectMutation.isPending;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "16px",
          padding: "24px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2>
            {isEditing
              ? "Modifier le projet"
              : "Nouveau projet"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 0,
              background: "transparent",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Titre</label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              required
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label>Statut</label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                }}
              >
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
            </div>

            <div>
              <label>Priorité</label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                }}
              >
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

          <div style={{ marginTop: "16px" }}>
            <label>Manager</label>

            <select
              value={managerId}
              onChange={(event) =>
                setManagerId(event.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            >
              <option value="1">
                Manager 1
              </option>

              <option value="2">
                Manager 2
              </option>

              <option value="3">
                Manager 3
              </option>
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <div>
              <label>Date de début</label>

              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div>
              <label>Date de fin</label>

              <input
                type="date"
                value={endDate}
                onChange={(event) =>
                  setEndDate(event.target.value)
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          {isEditing && (
            <div style={{ marginTop: "16px" }}>
              <label>
                Progression : {progress}%
              </label>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(event) =>
                  setProgress(
                    Number(event.target.value),
                  )
                }
                style={{
                  width: "100%",
                  marginTop: "8px",
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border:
                  "1px solid #cbd5e1",
                background: "white",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: 0,
                background: "#4f46e5",
                color: "white",
                cursor: "pointer",
              }}
            >
              {isPending
                ? "Enregistrement..."
                : isEditing
                  ? "Enregistrer"
                  : "Créer le projet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}