import { useState } from "react";

import { useCreateTask } from "../hooks/useTasks";

import type {
  TaskPriority,
  TaskStatus,
} from "../types/task.types";

interface TaskFormModalProps {
  projectId: string;
  onClose: () => void;
}

export default function TaskFormModal({
  projectId,
  onClose,
}: TaskFormModalProps) {
  const createTaskMutation =
    useCreateTask();

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState<TaskStatus>("todo");

  const [priority, setPriority] =
    useState<TaskPriority>("medium");

  const [assigneeId, setAssigneeId] =
    useState("1");

  const [
    estimatedHours,
    setEstimatedHours,
  ] = useState(1);

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    await createTaskMutation.mutateAsync({
      projectId,
      title,
      description,
      status,
      priority,
      assigneeId,
      estimatedHours,
      createdAt:
        new Date().toISOString(),
    });

    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0, 0, 0, 0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
          background: "white",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Nouvelle tâche</h2>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 0,
              background:
                "transparent",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "16px",
            }}
          >
            <label>Titre</label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "16px",
            }}
          >
            <label>Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              required
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label>Statut</label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as TaskStatus,
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    "8px",
                }}
              >
                <option value="todo">
                  À faire
                </option>

                <option value="in_progress">
                  En cours
                </option>

                <option value="in_review">
                  En validation
                </option>

                <option value="done">
                  Terminé
                </option>
              </select>
            </div>

            <div>
              <label>Priorité</label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target
                      .value as TaskPriority,
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    "8px",
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

          <div
            style={{
              marginTop: "16px",
            }}
          >
            <label>
              Employé assigné
            </label>

            <select
              value={assigneeId}
              onChange={(event) =>
                setAssigneeId(
                  event.target.value,
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            >
              <option value="1">
                Employé 1
              </option>

              <option value="2">
                Employé 2
              </option>

              <option value="3">
                Employé 3
              </option>

              <option value="4">
                Employé 4
              </option>
            </select>
          </div>

          <div
            style={{
              marginTop: "16px",
            }}
          >
            <label>
              Estimation en heures
            </label>

            <input
              type="number"
              min="1"
              value={estimatedHours}
              onChange={(event) =>
                setEstimatedHours(
                  Number(
                    event.target.value,
                  ),
                )
              }
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding:
                  "10px 16px",
                borderRadius: "8px",
                border:
                  "1px solid #cbd5e1",
                background: "white",
              }}
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={
                createTaskMutation.isPending
              }
              style={{
                padding:
                  "10px 16px",
                borderRadius: "8px",
                border: 0,
                background: "#4f46e5",
                color: "white",
              }}
            >
              {createTaskMutation.isPending
                ? "Création..."
                : "Créer la tâche"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}