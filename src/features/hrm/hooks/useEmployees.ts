import { useQuery } from "@tanstack/react-query";

import {
  getEmployees,
  getTeams,
  getLeaves,
  getAttendance,
} from "../services/employeeService";

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
