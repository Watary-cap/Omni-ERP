import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createEmployee,
  createLeave,
  deleteEmployee,
  getAttendance,
  getEmployees,
  getLeaves,
  getTeams,
  updateEmployee,
  updateLeaveStatus,
} from "../services/employeeService";

import type { Employee } from "../types/employee.types";

/* =========================================================
   EMPLOYEES
========================================================= */

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: Omit<Employee, "id">) => createEmployee(employee),

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

/* =========================================================
   TEAMS
========================================================= */

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
}

/* =========================================================
   LEAVES
========================================================= */

export function useLeaves() {
  return useQuery({
    queryKey: ["leaves"],
    queryFn: getLeaves,
  });
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number | string;
      status: "approved" | "rejected";
    }) => updateLeaveStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });
    },
  });
}

/* =========================================================
   ATTENDANCE
========================================================= */

export function useAttendance() {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });
}

export function useCreateLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leave: Parameters<typeof createLeave>[0]) =>
      createLeave(leave),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
  });
}
