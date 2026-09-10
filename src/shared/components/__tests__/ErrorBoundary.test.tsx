import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ErrorBoundary from "../ErrorBoundary";

function Explose({ doit = true }: { doit?: boolean }) {
  if (doit) {
    throw new Error("Panne du composant");
  }

  return <p>Contenu sain</p>;
}

describe("<ErrorBoundary />", () => {
  it("rend ses enfants quand tout va bien", () => {
    render(
      <ErrorBoundary>
        <p>Contenu sain</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Contenu sain")).toBeInTheDocument();
  });

  it("intercepte une erreur de rendu et affiche le repli", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <Explose />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
    expect(screen.getByText("Panne du composant")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("accepte un repli personnalisé", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary fallback={(error) => <p>Repli : {error.message}</p>}>
        <Explose />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Repli : Panne du composant")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("permet de réessayer après une erreur", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    function Bascule() {
      return (
        <ErrorBoundary>
          <Explose doit={false} />
        </ErrorBoundary>
      );
    }

    const { rerender } = render(
      <ErrorBoundary>
        <Explose />
      </ErrorBoundary>,
    );

    await user.click(screen.getByRole("button", { name: "Réessayer" }));

    rerender(<Bascule />);

    expect(screen.getByText("Contenu sain")).toBeInTheDocument();

    spy.mockRestore();
  });
});
