import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getEmployees,
  getTeams,
  getLeaves,
  getAttendance,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";

import type { Employee } from "../types/employee.types";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
}

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
}

export function useLeaves() {
  return useQuery({
    queryKey: ["leaves"],
    queryFn: getLeaves,
  });
}

export function useAttendance() {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: Omit<Employee, "id">) =>
      createEmployee(employee),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      employee,
    }: {
      id: number;
      employee: Partial<Employee>;
    }) => updateEmployee(id, employee),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
}