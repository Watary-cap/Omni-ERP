import { useState, type FormEvent } from "react";

import { useCreateEmployee } from "../hooks/useEmployees";

interface EmployeeFormModalProps {
  onClose: () => void;
}

export default function EmployeeFormModal({
  onClose,
}: EmployeeFormModalProps) {
  const createEmployee = useCreateEmployee();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

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

      hireDate: new Date()
        .toISOString()
        .split("T")[0],

      location,

      avatar: `https://i.pravatar.cc/150?u=${email}`,

      skills: [],
    });

    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="employee-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="employee-form-header">
          <span className="welcome-label">
            RESSOURCES HUMAINES
          </span>

          <h2>Nouvel employé</h2>

          <p>
            Ajoutez un nouveau collaborateur à
            GlobalTech Solutions.
          </p>
        </div>

        <form
          className="employee-form"
          onSubmit={handleSubmit}
        >
          <div className="employee-form-grid">

            <div className="form-group">
              <label>Prénom</label>

              <input
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Nom</label>

              <input
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Téléphone</label>

              <input
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Poste</label>

              <input
                value={jobTitle}
                onChange={(event) =>
                  setJobTitle(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Département</label>

              <select
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
                required
              >
                <option value="">
                  Sélectionner
                </option>

                <option value="Ressources Humaines">
                  Ressources Humaines
                </option>

                <option value="Technologie">
                  Technologie
                </option>

                <option value="Commercial">
                  Commercial
                </option>

                <option value="Finance">
                  Finance
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Localisation</label>

              <input
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Paris"
                required
              />
            </div>

          </div>

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
              {createEmployee.isPending
                ? "Création..."
                : "Ajouter l'employé"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}