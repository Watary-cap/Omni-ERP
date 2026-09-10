import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

interface SubmitButtonProps {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
}

/**
 * React 19 — `useFormStatus` lit l'état du `<form>` parent sans qu'aucune
 * prop ne soit passée : le bouton connaît lui-même l'envoi en cours, ce
 * qui évite de faire remonter un état `isSubmitting` dans chaque écran.
 */
export default function SubmitButton({
  children,
  pendingLabel = "Envoi...",
  className = "primary-button",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
