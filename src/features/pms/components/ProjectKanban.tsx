import { useState } from "react";

import {
  useDeleteTask,
  useProjectTasks,
  useUpdateTask,
} from "../hooks/useTasks";

import type {
  Task,
  TaskStatus,
} from "../types/task.types";

import TaskFormModal from "./TaskFormModal";

interface ProjectKanbanProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

const columns: {
  status: TaskStatus;
  label: string;
}[] = [
  {
    status: "todo",
    label: "À faire",
  },
  {
    status: "in_progress",
    label: "En cours",
  },
  {
    status: "in_review",
    label: "En validation",
  },
  {
    status: "done",
    label: "Terminé",
  },
];

export default function ProjectKanban({
  projectId,
  projectTitle,
  onClose,
}: ProjectKanbanProps) {
  const tasksQuery =
    useProjectTasks(projectId);

  const updateTaskMutation =
    useUpdateTask();

  const deleteTaskMutation =
    useDeleteTask();

  const [
    isTaskModalOpen,
    setIsTaskModalOpen,
  ] = useState(false);

  const tasks = tasksQuery.data ?? [];

  function changeStatus(
    task: Task,
    status: TaskStatus,
  ) {
    updateTaskMutation.mutate({
      ...task,
      status,
    });
  }

  function handleDeleteTask(
    id: string,
  ) {
    const confirmation =
      window.confirm(
        "Supprimer cette tâche ?",
      );

    if (!confirmation) {
      return;
    }

    deleteTaskMutation.mutate(id);
  }

  function getNextStatus(
    status: TaskStatus,
  ): TaskStatus | null {
    switch (status) {
      case "todo":
        return "in_progress";

      case "in_progress":
        return "in_review";

      case "in_review":
        return "done";

      default:
        return null;
    }
  }

  function getPreviousStatus(
    status: TaskStatus,
  ): TaskStatus | null {
    switch (status) {
      case "done":
        return "in_review";

      case "in_review":
        return "in_progress";

      case "in_progress":
        return "todo";

      default:
        return null;
    }
  }

  if (tasksQuery.isLoading) {
    return (
      <div>
        Chargement des tâches...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 0,
              background:
                "transparent",
              color: "#4f46e5",
              cursor: "pointer",
              padding: 0,
              marginBottom: "10px",
            }}
          >
            ← Retour aux projets
          </button>

          <h1>{projectTitle}</h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Tableau Kanban du projet
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            setIsTaskModalOpen(true)
          }
        >
          + Nouvelle tâche
        </button>
      </div>

      {/* STATISTIQUES */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div className="dashboard-card">
          <strong>
            {tasks.length}
          </strong>

          <p>Total tâches</p>
        </div>

        <div className="dashboard-card">
          <strong>
            {
              tasks.filter(
                (task) =>
                  task.status === "done",
              ).length
            }
          </strong>

          <p>Terminées</p>
        </div>

        <div className="dashboard-card">
          <strong>
            {tasks.reduce(
              (total, task) =>
                total +
                task.estimatedHours,
              0,
            )}{" "}
            h
          </strong>

          <p>Temps estimé</p>
        </div>
      </div>

      {/* KANBAN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(250px, 1fr))",
          gap: "16px",
          overflowX: "auto",
          alignItems: "start",
        }}
      >
        {columns.map((column) => {
          const columnTasks =
            tasks.filter(
              (task) =>
                task.status ===
                column.status,
            );

          return (
            <div
              key={column.status}
              style={{
                background: "#f8fafc",
                borderRadius: "14px",
                padding: "14px",
                minHeight: "400px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom: "14px",
                }}
              >
                <h3>
                  {column.label}
                </h3>

                <span
                  style={{
                    background:
                      "#e2e8f0",
                    borderRadius:
                      "20px",
                    padding:
                      "4px 9px",
                    fontSize: "12px",
                  }}
                >
                  {
                    columnTasks.length
                  }
                </span>
              </div>

              {columnTasks.map(
                (task) => {
                  const nextStatus =
                    getNextStatus(
                      task.status,
                    );

                  const previousStatus =
                    getPreviousStatus(
                      task.status,
                    );

                  return (
                    <div
                      key={task.id}
                      style={{
                        background:
                          "white",
                        padding:
                          "14px",
                        borderRadius:
                          "10px",
                        marginBottom:
                          "12px",
                        boxShadow:
                          "0 1px 3px rgba(0,0,0,0.08)",
                      }}
                    >
                      <h4
                        style={{
                          marginBottom:
                            "8px",
                        }}
                      >
                        {task.title}
                      </h4>

                      <p
                        style={{
                          fontSize:
                            "13px",
                          color:
                            "#64748b",
                          marginBottom:
                            "12px",
                        }}
                      >
                        {
                          task.description
                        }
                      </p>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "6px",
                          flexWrap:
                            "wrap",
                          marginBottom:
                            "10px",
                        }}
                      >
                        <span
                          style={{
                            background:
                              task.priority ===
                              "critical"
                                ? "#fee2e2"
                                : "#fef3c7",

                            padding:
                              "4px 8px",

                            borderRadius:
                              "20px",

                            fontSize:
                              "11px",
                          }}
                        >
                          {
                            task.priority
                          }
                        </span>

                        <span
                          style={{
                            background:
                              "#eef2ff",
                            padding:
                              "4px 8px",
                            borderRadius:
                              "20px",
                            fontSize:
                              "11px",
                          }}
                        >
                          {
                            task.estimatedHours
                          }{" "}
                          h
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize:
                            "12px",
                          color:
                            "#64748b",
                          marginBottom:
                            "12px",
                        }}
                      >
                        Employé :
                        {" "}
                        {
                          task.assigneeId
                        }
                      </p>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "6px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        {previousStatus && (
                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(
                                task,
                                previousStatus,
                              )
                            }
                            style={{
                              border: 0,
                              background:
                                "#e2e8f0",
                              padding:
                                "6px 8px",
                              borderRadius:
                                "6px",
                              cursor:
                                "pointer",
                            }}
                          >
                            ←
                          </button>
                        )}

                        {nextStatus && (
                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(
                                task,
                                nextStatus,
                              )
                            }
                            style={{
                              border: 0,
                              background:
                                "#dcfce7",
                              padding:
                                "6px 8px",
                              borderRadius:
                                "6px",
                              cursor:
                                "pointer",
                            }}
                          >
                            →
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteTask(
                              task.id,
                            )
                          }
                          style={{
                            border: 0,
                            background:
                              "#fee2e2",
                            color:
                              "#dc2626",
                            padding:
                              "6px 8px",
                            borderRadius:
                              "6px",
                            cursor:
                              "pointer",
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                },
              )}

              {columnTasks.length ===
                0 && (
                <p
                  style={{
                    textAlign:
                      "center",
                    color:
                      "#94a3b8",
                    fontSize:
                      "13px",
                    marginTop:
                      "30px",
                  }}
                >
                  Aucune tâche
                </p>
              )}
            </div>
          );
        })}
      </div>

      {isTaskModalOpen && (
        <TaskFormModal
          projectId={projectId}
          onClose={() =>
            setIsTaskModalOpen(false)
          }
        />
      )}
    </div>
  );
}