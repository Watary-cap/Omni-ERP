import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportError } from "../monitoring/errorReporter";

interface ErrorBoundaryProps {
  children: ReactNode;
  /* Interface de repli ; reçoit l'erreur et une fonction de réinitialisation */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Seule une classe peut intercepter une erreur de rendu : les hooks n'ont
 * pas d'équivalent à componentDidCatch. Placée haut dans l'arbre, elle
 * empêche qu'un composant fautif ne vide toute la page.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, { componentStack: info.componentStack });
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (!error) {
      return children;
    }

    if (fallback) {
      return fallback(error, this.reset);
    }

    return (
      <div className="dashboard-card error-boundary">
        <div className="empty-state">
          <div className="empty-state-icon">!</div>

          <strong>Une erreur est survenue</strong>

          <p>
            Cette section n'a pas pu s'afficher. Les autres parties de
            l'application restent utilisables.
          </p>

          <p className="error-boundary-detail">{error.message}</p>

          <button type="button" className="primary-button" onClick={this.reset}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }
}
