import type { Employee } from "../types/employee.types";

interface SkillsProps {
  employees: Employee[];
}

export default function Skills({ employees }: SkillsProps) {
  const skills = employees.flatMap((employee) =>
    employee.skills.map((skill) => ({
      ...skill,
      employee,
    })),
  );

  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <div>
          <h3>Compétences</h3>

          <p>Vue des compétences disponibles</p>
        </div>
      </div>

      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div className="skill-card" key={`${skill.id}-${index}`}>
            <div className="skill-card-header">
              <div className="skill-icon">✦</div>

              <span>{skill.level}/5</span>
            </div>

            <strong>{skill.name}</strong>

            <small>
              {skill.employee.firstName} {skill.employee.lastName}
            </small>

            <div className="skill-progress">
              <div
                style={{
                  width: `${skill.level * 20}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
