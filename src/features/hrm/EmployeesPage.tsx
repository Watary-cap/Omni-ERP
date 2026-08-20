import { useMemo, useState } from "react";

import HrmStats from "./components/HrmStats";
import EmployeeList from "./components/EmployeeList";
import EmployeeModal from "./components/EmployeeModal";
import OrganizationChart from "./components/OrganizationChart";
import LeaveManagement from "./components/LeaveManagement";
import Attendance from "./components/Attendance";
import Skills from "./components/Skills";

import { useEmployees, useLeaves, useAttendance } from "./hooks/useEmployees";

import type { Employee } from "./types/employee.types";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const employeesQuery = useEmployees();
  const leavesQuery = useLeaves();
  const attendanceQuery = useAttendance();

  const employees = employeesQuery.data ?? [];

  const leaves = leavesQuery.data ?? [];

  const attendance = attendanceQuery.data ?? [];

  const activeEmployees = useMemo(
    () =>
      employees.filter(
        (employee: { status: string }) => employee.status === "active",
      ).length,
    [employees],
  );

  const remoteEmployees = useMemo(
    () =>
      attendance.filter((item: { status: string }) => item.status === "remote")
        .length,
    [attendance],
  );

  const pendingLeaves = useMemo(
    () =>
      leaves.filter((leave: { status: string }) => leave.status === "pending")
        .length,
    [leaves],
  );

  const isLoading =
    employeesQuery.isLoading ||
    leavesQuery.isLoading ||
    attendanceQuery.isLoading;

  if (isLoading) {
    return (
      <div className="hrm-loading">
        <div className="loading-spinner" />

        <p>Chargement des données RH...</p>
      </div>
    );
  }

  if (
    employeesQuery.isError ||
    leavesQuery.isError ||
    attendanceQuery.isError
  ) {
    return (
      <div className="dashboard-card">
        <div className="empty-state">
          <div className="empty-state-icon">!</div>

          <strong>Impossible de charger les données</strong>

          <p>Vérifiez que JSON Server est bien démarré.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard hrm-page">
      {/* HEADER */}
      <div className="dashboard-heading">
        <div>
          <span className="welcome-label">RESSOURCES HUMAINES</span>

          <h1>Gestion des collaborateurs</h1>

          <p>Gérez vos employés, équipes, compétences, congés et présences.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            alert(
              "La création d'un employé sera ajoutée dans la prochaine étape.",
            );
          }}
        >
          + Nouvel employé
        </button>
      </div>

      {/* KPI */}
      <HrmStats
        total={employees.length}
        active={activeEmployees}
        remote={remoteEmployees}
        pendingLeaves={pendingLeaves}
      />

      {/* EMPLOYES */}
      <EmployeeList
        employees={employees}
        search={search}
        department={department}
        status={status}
        onSearchChange={setSearch}
        onDepartmentChange={setDepartment}
        onStatusChange={setStatus}
        onSelect={setSelectedEmployee}
      />

      {/* CONGES + PRESENCE */}
      <div className="dashboard-grid">
        <LeaveManagement leaves={leaves} employees={employees} />

        <Attendance attendance={attendance} employees={employees} />
      </div>

      {/* ORGANIGRAMME */}
      <OrganizationChart employees={employees} />

      {/* COMPETENCES */}
      <Skills employees={employees} />

      {/* MODAL */}
      <EmployeeModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}
