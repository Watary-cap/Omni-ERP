import type { Employee } from "../types/employee.types";

interface EmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
}

export default function EmployeeModal({
  employee,
  onClose,
}: EmployeeModalProps) {
  if (!employee) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="employee-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="employee-modal-header">
          <img src={employee.avatar} alt="" />

          <div>
            <h2>
              {employee.firstName} {employee.lastName}
            </h2>

            <p>{employee.jobTitle}</p>

            <span className={`employee-status ${employee.status}`}>
              <span />
              {employee.status === "active" ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>

        <div className="employee-details">
          <div>
            <span>Email</span>
            <strong>{employee.email}</strong>
          </div>

          <div>
            <span>Téléphone</span>
            <strong>{employee.phone}</strong>
          </div>

          <div>
            <span>Département</span>
            <strong>{employee.department}</strong>
          </div>

          <div>
            <span>Localisation</span>
            <strong>{employee.location}</strong>
          </div>

          <div>
            <span>Date d'arrivée</span>
            <strong>
              {new Date(employee.hireDate).toLocaleDateString("fr-FR")}
            </strong>
          </div>
        </div>

        <div className="employee-skills">
          <h3>Compétences</h3>

          <div>
            {employee.skills.map((skill) => (
              <span key={skill.id} className="skill-badge">
                {skill.name}
                <small>{skill.level}/5</small>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
