import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskService";

import type { Task } from "../types/task.types";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

/**
 * Mise à jour optimiste : le Kanban doit réagir au déplacement d'une carte
 * sans attendre l'aller-retour serveur. Le cache est modifié tout de suite
 * et restauré si la requête échoue.
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,

    onMutate: async (task: Task) => {
      // On annule les requêtes en vol pour qu'elles n'écrasent pas
      // l'état optimiste en revenant.
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (current) =>
        current?.map((item) => (item.id === task.id ? task : item)),
      );

      return { previousTasks };
    },

    onError: (_error, _task, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteTask(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

export function useProjectTasks(
  projectId: string,
) {
  const tasksQuery = useTasks();

  const tasks: Task[] =
    tasksQuery.data?.filter(
      (task) =>
        task.projectId === projectId,
    ) ?? [];

  return {
    ...tasksQuery,
    data: tasks,
  };
}