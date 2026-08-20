import type { Employee } from "../types/employee.types";

interface OrganizationChartProps {
  employees: Employee[];
}

export default function OrganizationChart({
  employees,
}: OrganizationChartProps) {
  const managers = employees.filter((employee) => employee.managerId === null);

  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <div>
          <h3>Organigramme</h3>
          <p>Structure hiérarchique de l'entreprise</p>
        </div>
      </div>

      <div className="organization-chart">
        {managers.map((manager) => {
          const team = employees.filter(
            (employee) => employee.managerId === manager.id,
          );

          return (
            <div className="organization-group" key={manager.id}>
              <div className="organization-manager">
                <img src={manager.avatar} alt="" />

                <div>
                  <strong>
                    {manager.firstName} {manager.lastName}
                  </strong>

                  <span>{manager.jobTitle}</span>
                </div>
              </div>

              {team.length > 0 && (
                <div className="organization-team">
                  {team.map((employee) => (
                    <div className="organization-member" key={employee.id}>
                      <img src={employee.avatar} alt="" />

                      <div>
                        <strong>
                          {employee.firstName} {employee.lastName}
                        </strong>

                        <span>{employee.jobTitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
