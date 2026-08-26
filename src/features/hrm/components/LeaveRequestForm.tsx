import { useState, type FormEvent } from "react";

import { useCreateLeave } from "../hooks/useEmployees";
import type { LeaveRequest } from "../types/employee.types";

interface LeaveRequestFormProps {
  employeeId: number | string;
}

function getDays(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
}

export default function LeaveRequestForm({
  employeeId,
}: LeaveRequestFormProps) {
  const createLeave = useCreateLeave();
  const [type, setType] = useState("Congés payés");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const days = getDays(startDate, endDate);

    if (days <= 0) {
      setError(
        "La date de fin doit être postérieure ou égale à la date de début.",
      );
      return;
    }

    setError("");
    createLeave.mutate(
      {
        employeeId,
        type,
        startDate,
        endDate,
        days,
        status: "pending",
        reason: reason.trim() || "Demande de congé",
      },
      {
        onSuccess: () => {
          setStartDate("");
          setEndDate("");
          setReason("");
        },
      },
    );
  };

  return (
    <section className="dashboard-card leave-request-card">
      <div className="card-heading">
        <div>
          <h3>Faire une demande</h3>
          <p>Votre manager validera votre demande.</p>
        </div>
      </div>

      <form className="leave-request-form" onSubmit={handleSubmit}>
        <div className="leave-request-grid">
          <div className="form-group">
            <label htmlFor="leave-type">Type</label>
            <select
              id="leave-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option>Congés payés</option>
              <option>RTT</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="leave-start">Du</label>
            <input
              id="leave-start"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="leave-end">Au</label>
            <input
              id="leave-end"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="leave-reason">Motif</label>
            <input
              id="leave-reason"
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Motif de la demande"
            />
          </div>
        </div>

        {error && (
          <p className="leave-form-error" role="alert">
            {error}
          </p>
        )}
        {createLeave.isError && (
          <p className="leave-form-error" role="alert">
            Impossible d'envoyer la demande.
          </p>
        )}
        {createLeave.isSuccess && (
          <p className="leave-form-success" role="status">
            Demande envoyée, en attente de validation.
          </p>
        )}

        <button
          className="primary-button"
          type="submit"
          disabled={createLeave.isPending}
        >
          {createLeave.isPending ? "Envoi..." : "Envoyer la demande"}
        </button>
      </form>
    </section>
  );
}
