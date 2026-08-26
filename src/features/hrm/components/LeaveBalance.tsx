import type { LeaveRequest } from "../types/employee.types";

interface LeaveBalanceProps {
  leaves: LeaveRequest[];
}

const balances = [
  { type: "Congés payés", acquired: 25 },
  { type: "RTT", acquired: 10 },
];

export default function LeaveBalance({ leaves }: LeaveBalanceProps) {
  return (
    <section className="leave-balance-grid" aria-label="Solde de congés">
      {balances.map((balance) => {
        const approved = leaves
          .filter(
            (leave) =>
              leave.type === balance.type && leave.status === "approved",
          )
          .reduce((total, leave) => total + leave.days, 0);
        const pending = leaves
          .filter(
            (leave) =>
              leave.type === balance.type && leave.status === "pending",
          )
          .reduce((total, leave) => total + leave.days, 0);

        return (
          <article className="leave-balance-item" key={balance.type}>
            <span>{balance.type}</span>
            <strong>{Math.max(0, balance.acquired - approved)} jours</strong>
            <small>
              {balance.acquired} acquis · {approved} pris · {pending} en cours
            </small>
          </article>
        );
      })}
    </section>
  );
}
