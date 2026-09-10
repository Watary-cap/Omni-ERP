import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Modal from "../Modal";

describe("<Modal /> (portail)", () => {
  it("ne rend rien quand elle est fermée", () => {
    render(
      <Modal isOpen={false} onClose={() => undefined}>
        <p>Contenu</p>
      </Modal>,
    );

    expect(screen.queryByText("Contenu")).toBeNull();
  });

  it("se rend hors de l'arbre du parent, directement dans body", () => {
    const { container } = render(
      <Modal isOpen title="Titre" onClose={() => undefined}>
        <p>Contenu</p>
      </Modal>,
    );

    // Le conteneur du parent reste vide : le contenu est ailleurs dans le DOM
    expect(container).toBeEmptyDOMElement();
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });

  it("expose un dialogue accessible", () => {
    render(
      <Modal isOpen title="Confirmer" onClose={() => undefined}>
        <p>Contenu</p>
      </Modal>,
    );

    const dialogue = screen.getByRole("dialog");

    expect(dialogue).toHaveAttribute("aria-modal", "true");
    expect(dialogue).toHaveAccessibleName("Confirmer");
  });

  it("ferme au clic sur le fond et via le bouton", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen title="Titre" onClose={onClose}>
        <p>Contenu</p>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Fermer" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("ne ferme pas au clic à l'intérieur du dialogue", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose}>
        <p>Contenu</p>
      </Modal>,
    );

    await user.click(screen.getByText("Contenu"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("ferme à la touche Échap et libère le défilement", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { unmount } = render(
      <Modal isOpen onClose={onClose}>
        <p>Contenu</p>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();

    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
