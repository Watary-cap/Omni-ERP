import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Rendue dans un nœud frère de #root via un portail : la modale échappe
 * ainsi à tout `overflow: hidden` ou `z-index` d'un parent.
 */
export default function Modal({
  isOpen,
  title,
  onClose,
  children,
}: ModalProps) {
  // Échap ferme la modale, et le défilement de la page est gelé pendant
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="employee-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
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

        {title && (
          <div className="employee-form-header">
            <h2>{title}</h2>
          </div>
        )}

        {children}
      </div>
    </div>,
    document.body,
  );
}
