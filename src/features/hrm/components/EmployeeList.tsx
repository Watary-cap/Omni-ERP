import type { Employee } from "../types/employee.types";

interface EmployeeListProps {
  employees: Employee[];
  search: string;
  department: string;
  status: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSelect: (employee: Employee) => void;
}

export default function EmployeeList({
  employees,
  search,
  department,
  status,
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  onSelect,
}: EmployeeListProps) {
  const departments = [
    ...new Set(employees.map((employee) => employee.department)),
  ];

  const filteredEmployees = employees.filter((employee) => {
    const searchValue =
      `${employee.firstName} ${employee.lastName} ${employee.email}`.toLowerCase();

    const matchesSearch = searchValue.includes(search.toLowerCase());

    const matchesDepartment = !department || employee.department === department;

    const matchesStatus = !status || employee.status === status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <section className="dashboard-card employee-section">
      <div className="card-heading">
        <div>
          <h3>Collaborateurs</h3>

          <p>Gestion des employés de l'entreprise</p>
        </div>

        <span className="card-counter">
          {filteredEmployees.length} résultat
          {filteredEmployees.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="employee-filters">
        <div className="employee-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Rechercher un employé..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <select
          value={department}
          onChange={(event) => onDepartmentChange(event.target.value)}
        >
          <option value="">Tous les départements</option>

          {departments.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="">Tous les statuts</option>

          <option value="active">Actif</option>

          <option value="inactive">Inactif</option>
        </select>
      </div>

      <div className="employee-table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Poste</th>
              <th>Département</th>
              <th>Localisation</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="employee-identity">
                    <img
                      src={employee.avatar}
                      alt={`${employee.firstName} ${employee.lastName}`}
                    />

                    <div>
                      <strong>
                        {employee.firstName} {employee.lastName}
                      </strong>

                      <span>{employee.email}</span>
                    </div>
                  </div>
                </td>

                <td>{employee.jobTitle}</td>

                <td>
                  <span className="department-badge">
                    {employee.department}
                  </span>
                </td>

                <td>{employee.location}</td>

                <td>
                  <span className={`employee-status ${employee.status}`}>
                    <span />
                    {employee.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </td>

                <td>
                  <button
                    className="employee-view-button"
                    onClick={() => onSelect(employee)}
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEmployees.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>

            <strong>Aucun employé trouvé</strong>

            <p>Modifiez vos critères de recherche.</p>
          </div>
        )}
      </div>
    </section>
  );
}
