import type {
  Attendance as AttendanceType,
  Employee,
} from "../types/employee.types";

interface AttendanceProps {
  attendance: AttendanceType[];
  employees: Employee[];
}

export default function Attendance({ attendance, employees }: AttendanceProps) {
  const getEmployee = (id: number) =>
    employees.find((employee) => employee.id === id);

  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <div>
          <h3>Présence aujourd'hui</h3>

          <p>Suivi de la présence des employés</p>
        </div>
      </div>

      <div className="attendance-list">
        {attendance.map((item) => {
          const employee = getEmployee(item.employeeId);

          if (!employee) {
            return null;
          }

          const labels = {
            present: "Présent",
            absent: "Absent",
            remote: "Télétravail",
            late: "En retard",
          };

          return (
            <div className="attendance-item" key={item.id}>
              <div className="employee-identity">
                <img src={employee.avatar} alt="" />

                <div>
                  <strong>
                    {employee.firstName} {employee.lastName}
                  </strong>

                  <span>{employee.jobTitle}</span>
                </div>
              </div>

              <span className={`attendance-status ${item.status}`}>
                <span />

                {labels[item.status]}
              </span>

              <div className="attendance-hours">
                <span>Arrivée</span>

                <strong>{item.arrival ?? "—"}</strong>
              </div>

              <div className="attendance-hours">
                <span>Départ</span>

                <strong>{item.departure ?? "—"}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
