import { useMemo, useState } from "react";

import HrmStats from "./components/HrmStats";
import EmployeeList from "./components/EmployeeList";
import EmployeeModal from "./components/EmployeeModal";
import EmployeeFormModal from "./components/EmployeeFormModal";
import OrganizationChart from "./components/OrganizationChart";
import LeaveManagement from "./components/LeaveManagement";
import Attendance from "./components/Attendance";
import Skills from "./components/Skills";
import LeaveBalance from "./components/LeaveBalance";
import LeaveRequestForm from "./components/LeaveRequestForm";

import { useEmployees, useLeaves, useAttendance } from "./hooks/useEmployees";

import type { Employee } from "./types/employee.types";
import { useAuth } from "../auth/hooks/useAuth";

export default function EmployeesPage() {
  const { user } = useAuth();
  const isEmployee = user?.role === "user";
  const isManager = user?.role === "manager";
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [showCreateEmployee, setShowCreateEmployee] = useState(false);

  const employeesQuery = useEmployees();
  const leavesQuery = useLeaves();
  const attendanceQuery = useAttendance();

  const employees = employeesQuery.data ?? [];
  const leaves = leavesQuery.data ?? [];
  const attendance = attendanceQuery.data ?? [];

  const activeEmployees = useMemo(() => {
    return employees.filter((employee) => employee.status === "active").length;
  }, [employees]);

  const remoteEmployees = useMemo(() => {
    return attendance.filter((item) => item.status === "remote").length;
  }, [attendance]);

  const pendingLeaves = useMemo(() => {
    return leaves.filter((leave) => leave.status === "pending").length;
  }, [leaves]);

  const personalLeaves = useMemo(
    () =>
      leaves.filter(
        (leave) => String(leave.employeeId) === String(user?.employeeId),
      ),
    [leaves, user?.employeeId],
  );

  const teamLeaves = useMemo(
    () =>
      leaves.filter((leave) => {
        const employee = employees.find(
          (item) => String(item.id) === String(leave.employeeId),
        );
        return (
          employee && String(employee.managerId) === String(user?.employeeId)
        );
      }),
    [employees, leaves, user?.employeeId],
  );

  const teamEmployees = useMemo(
    () =>
      employees.filter(
        (employee) => String(employee.managerId) === String(user?.employeeId),
      ),
    [employees, user?.employeeId],
  );

  const isLoading =
    employeesQuery.isLoading ||
    leavesQuery.isLoading ||
    attendanceQuery.isLoading;

  const isError =
    employeesQuery.isError || leavesQuery.isError || attendanceQuery.isError;

  if (isLoading) {
    return (
      <div className="hrm-loading">
        <div className="loading-spinner" />

        <p>Chargement des données RH...</p>
      </div>
    );
  }

  if (isError) {
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
      {/* ========================= */}
      {/* HEADER                    */}
      {/* ========================= */}

      <div className="dashboard-heading">
        <div>
          <span className="welcome-label">RESSOURCES HUMAINES</span>

          <h1>
            {isEmployee
              ? "Mes congés"
              : isManager
                ? "Espace manager"
                : "Gestion des collaborateurs"}
          </h1>

          <p>
            {isEmployee || isManager
              ? "Consultez vos droits et envoyez une demande de congé."
              : "Gérez vos employés, équipes, compétences, congés et présences."}
          </p>
        </div>

        {!isEmployee && (
          <button
            className="primary-button"
            onClick={() => setShowCreateEmployee(true)}
          >
            + Nouvel employé
          </button>
        )}
      </div>

      {(isEmployee || isManager) && user.employeeId !== null ? (
        <>
          <LeaveBalance leaves={personalLeaves} />
          <LeaveRequestForm employeeId={user.employeeId} />
          <LeaveManagement
            leaves={personalLeaves}
            employees={employees}
            canApprove={false}
            title="Mes demandes"
            description="Suivez vos demandes personnelles."
          />
          {isManager && (
            <>
              <LeaveManagement
                leaves={teamLeaves}
                employees={employees}
                title="Demandes de mon équipe"
                description="Validez les demandes de vos collaborateurs."
              />
              <Skills employees={teamEmployees} />
            </>
          )}
        </>
      ) : (
        <>
          <HrmStats
            total={employees.length}
            active={activeEmployees}
            remote={remoteEmployees}
            pendingLeaves={pendingLeaves}
          />

          {/* ========================= */}
          {/* EMPLOYES                  */}
          {/* ========================= */}

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

          {/* ========================= */}
          {/* CONGES + PRESENCE         */}
          {/* ========================= */}

          <div className="dashboard-grid">
            <LeaveManagement leaves={leaves} employees={employees} />

            <Attendance attendance={attendance} employees={employees} />
          </div>

          {/* ========================= */}
          {/* ORGANIGRAMME              */}
          {/* ========================= */}

          <OrganizationChart employees={employees} />

          {/* ========================= */}
          {/* COMPETENCES               */}
          {/* ========================= */}

          <Skills employees={employees} />
        </>
      )}

      {/* ========================= */}
      {/* DETAIL EMPLOYE            */}
      {/* ========================= */}

      <EmployeeModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

      {/* ========================= */}
      {/* CREATION EMPLOYE          */}
      {/* ========================= */}

      {showCreateEmployee && (
        <EmployeeFormModal onClose={() => setShowCreateEmployee(false)} />
      )}
    </div>
  );
}
