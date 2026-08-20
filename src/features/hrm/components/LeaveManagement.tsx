import type { Employee, LeaveRequest } from "../types/employee.types";

interface LeaveManagementProps {
  leaves: LeaveRequest[];
  employees: Employee[];
}

export default function LeaveManagement({
  leaves,
  employees,
}: LeaveManagementProps) {
  const getEmployee = (id: number) =>
    employees.find((employee) => employee.id === id);

  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <div>
          <h3>Demandes de congés</h3>

          <p>Suivi des demandes des collaborateurs</p>
        </div>
      </div>

      <div className="leave-list">
        {leaves.map((leave) => {
          const employee = getEmployee(leave.employeeId);

          if (!employee) {
            return null;
          }

          return (
            <div className="leave-item" key={leave.id}>
              <div className="employee-identity">
                <img src={employee.avatar} alt="" />

                <div>
                  <strong>
                    {employee.firstName} {employee.lastName}
                  </strong>

                  <span>{leave.type}</span>
                </div>
              </div>

              <div className="leave-dates">
                <strong>
                  {leave.days} jour
                  {leave.days > 1 ? "s" : ""}
                </strong>

                <span>
                  {new Date(leave.startDate).toLocaleDateString("fr-FR")} →{" "}
                  {new Date(leave.endDate).toLocaleDateString("fr-FR")}
                </span>
              </div>

              <span className={`leave-status ${leave.status}`}>
                {leave.status === "approved" && "Approuvé"}

                {leave.status === "pending" && "En attente"}

                {leave.status === "rejected" && "Refusé"}
              </span>
            </div>
          );
        })}

        {leaves.length === 0 && (
          <div className="empty-state">
            <strong>Aucune demande de congé</strong>
          </div>
        )}
      </div>
    </section>
  );
}
