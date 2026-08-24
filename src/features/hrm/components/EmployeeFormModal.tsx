import { useState, type FormEvent } from "react";

import { useCreateEmployee } from "../hooks/useEmployees";

interface EmployeeFormModalProps {
  onClose: () => void;
}

interface EmployeeSkill {
  id: number;
  name: string;
  level: number;
}

export default function EmployeeFormModal({ onClose }: EmployeeFormModalProps) {
  const createEmployee = useCreateEmployee();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");

  // Compétences
  const [skills, setSkills] = useState<EmployeeSkill[]>([]);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState(3);

  function handleAddSkill() {
    const name = skillName.trim();

    if (!name) {
      return;
    }

    // Évite d'ajouter deux fois la même compétence
    const alreadyExists = skills.some(
      (skill) => skill.name.toLowerCase() === name.toLowerCase(),
    );

    if (alreadyExists) {
      return;
    }

    const newSkill: EmployeeSkill = {
      id: Date.now(),
      name,
      level: skillLevel,
    };

    setSkills((currentSkills) => [...currentSkills, newSkill]);

    setSkillName("");
    setSkillLevel(3);
  }

  function handleRemoveSkill(id: number) {
    setSkills((currentSkills) =>
      currentSkills.filter((skill) => skill.id !== id),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createEmployee.mutateAsync({
        firstName,
        lastName,
        email,
        phone,
        jobTitle,
        department,

        teamId: null,
        managerId: null,

        status: "active",

        hireDate: new Date().toISOString().split("T")[0],

        location,

        avatar: `https://i.pravatar.cc/150?u=${email}`,

        skills,
      });

      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de l'employé :", error);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="employee-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>

        <div className="employee-form-header">
          <span className="welcome-label">RESSOURCES HUMAINES</span>

          <h2>Nouvel employé</h2>

          <p>Ajoutez un nouveau collaborateur à GlobalTech Solutions.</p>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="employee-form-grid">
            {/* Prénom */}
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>

              <input
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </div>

            {/* Nom */}
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>

              <input
                id="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            {/* Téléphone */}
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>

              <input
                id="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            {/* Poste */}
            <div className="form-group">
              <label htmlFor="jobTitle">Poste</label>

              <input
                id="jobTitle"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                required
              />
            </div>

            {/* Département */}
            <div className="form-group">
              <label htmlFor="department">Département</label>

              <select
                id="department"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                required
              >
                <option value="">Sélectionner</option>

                <option value="Ressources Humaines">Ressources Humaines</option>

                <option value="Technologie">Technologie</option>

                <option value="Commercial">Commercial</option>

                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Localisation */}
            <div className="form-group">
              <label htmlFor="location">Localisation</label>

              <input
                id="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Paris"
                required
              />
            </div>
          </div>

          {/* COMPÉTENCES */}
          <div className="form-group skills-form-group">
            <label htmlFor="skillName">Compétences</label>

            <div className="skill-input-row">
              <input
                id="skillName"
                value={skillName}
                onChange={(event) => setSkillName(event.target.value)}
                placeholder="Ex : React, TypeScript..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddSkill();
                  }
                }}
              />

              <select
                value={skillLevel}
                onChange={(event) => setSkillLevel(Number(event.target.value))}
                aria-label="Niveau de compétence"
              >
                <option value={1}>1/5</option>
                <option value={2}>2/5</option>
                <option value={3}>3/5</option>
                <option value={4}>4/5</option>
                <option value={5}>5/5</option>
              </select>

              <button
                type="button"
                className="secondary-button"
                onClick={handleAddSkill}
                disabled={!skillName.trim()}
              >
                + Ajouter
              </button>
            </div>

            {/* Liste des compétences */}
            {skills.length > 0 && (
              <div className="selected-skills">
                {skills.map((skill) => (
                  <div key={skill.id} className="selected-skill">
                    <span>
                      {skill.name}
                      <small>{skill.level}/5</small>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      aria-label={`Supprimer ${skill.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="employee-form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Annuler
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={createEmployee.isPending}
            >
              {createEmployee.isPending ? "Création..." : "Ajouter l'employé"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
