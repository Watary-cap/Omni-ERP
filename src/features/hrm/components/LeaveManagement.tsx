import type {
  Employee,
  LeaveRequest,
} from "../types/employee.types";

import { useUpdateLeaveStatus } from "../hooks/useEmployees";

interface LeaveManagementProps {
  leaves: LeaveRequest[];
  employees: Employee[];
}

export default function LeaveManagement({
  leaves,
  employees,
}: LeaveManagementProps) {
  const updateLeaveStatus = useUpdateLeaveStatus();

  const getEmployee = (id: number) =>
    employees.find(
      (employee) =>
        String(employee.id) === String(id),
    );

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "pending",
  ).length;

  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <div>
          <h3>Demandes de congés</h3>

          <p>
            Suivi des demandes des collaborateurs
          </p>
        </div>

        <span className="card-counter">
          {pendingLeaves} en attente
        </span>
      </div>

      <div className="leave-list">
        {leaves.map((leave) => {
          const employee = getEmployee(
            leave.employeeId,
          );

          return (
            <div
              className="leave-item"
              key={leave.id}
            >
              {/* EMPLOYÉ */}
              <div className="employee-identity">
                {employee ? (
                  <>
                    <img
                      src={employee.avatar}
                      alt={`${employee.firstName} ${employee.lastName}`}
                    />

                    <div>
                      <strong>
                        {employee.firstName}{" "}
                        {employee.lastName}
                      </strong>

                      <span>{leave.type}</span>
                    </div>
                  </>
                ) : (
                  <div>
                    <strong>
                      Employé #{leave.employeeId}
                    </strong>

                    <span>{leave.type}</span>
                  </div>
                )}
              </div>

              {/* DATES */}
              <div className="leave-dates">
                <strong>
                  {leave.days} jour
                  {leave.days > 1 ? "s" : ""}
                </strong>

                <span>
                  {new Date(
                    leave.startDate,
                  ).toLocaleDateString("fr-FR")}
                  {" → "}
                  {new Date(
                    leave.endDate,
                  ).toLocaleDateString("fr-FR")}
                </span>

                <small>{leave.reason}</small>
              </div>

              {/* STATUT */}
              <div className="leave-status-area">
                <span
                  className={`leave-status ${leave.status}`}
                >
                  {leave.status === "approved" &&
                    "Approuvé"}

                  {leave.status === "pending" &&
                    "En attente"}

                  {leave.status === "rejected" &&
                    "Refusé"}
                </span>

                {/* ACTIONS */}
                {leave.status === "pending" && (
                  <div className="leave-actions">
                    <button
                      type="button"
                      className="leave-approve-button"
                      disabled={
                        updateLeaveStatus.isPending
                      }
                      onClick={() =>
                        updateLeaveStatus.mutate({
                          id: leave.id,
                          status: "approved",
                        })
                      }
                      title="Approuver"
                    >
                      ✓
                    </button>

                    <button
                      type="button"
                      className="leave-reject-button"
                      disabled={
                        updateLeaveStatus.isPending
                      }
                      onClick={() =>
                        updateLeaveStatus.mutate({
                          id: leave.id,
                          status: "rejected",
                        })
                      }
                      title="Refuser"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {leaves.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              ◷
            </div>

            <strong>
              Aucune demande de congé
            </strong>

            <p>
              Les demandes apparaîtront ici.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}