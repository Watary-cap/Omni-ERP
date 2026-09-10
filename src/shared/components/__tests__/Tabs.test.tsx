import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Tabs from "../Tabs";

function Exemple({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <Tabs defaultValue="un" onValueChange={onValueChange}>
      <Tabs.List>
        <Tabs.Trigger value="un">Premier</Tabs.Trigger>
        <Tabs.Trigger value="deux" count={3}>
          Deuxième
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="un">Contenu un</Tabs.Panel>
      <Tabs.Panel value="deux">Contenu deux</Tabs.Panel>
    </Tabs>
  );
}

describe("<Tabs /> (compound component)", () => {
  it("n'affiche que le panneau actif", () => {
    render(<Exemple />);

    expect(screen.getByText("Contenu un")).toBeInTheDocument();
    expect(screen.queryByText("Contenu deux")).toBeNull();
  });

  it("change de panneau au clic", async () => {
    const user = userEvent.setup();

    render(<Exemple />);

    await user.click(screen.getByRole("tab", { name: /Deuxième/ }));

    expect(screen.getByText("Contenu deux")).toBeInTheDocument();
    expect(screen.queryByText("Contenu un")).toBeNull();
  });

  it("câble les attributs ARIA entre onglet et panneau", async () => {
    const user = userEvent.setup();

    render(<Exemple />);

    const onglet = screen.getByRole("tab", { name: "Premier" });

    expect(onglet).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      onglet.id,
    );

    await user.click(screen.getByRole("tab", { name: /Deuxième/ }));

    expect(onglet).toHaveAttribute("aria-selected", "false");
  });

  it("prévient l'appelant du changement d'onglet", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<Exemple onValueChange={onValueChange} />);

    await user.click(screen.getByRole("tab", { name: /Deuxième/ }));

    expect(onValueChange).toHaveBeenCalledWith("deux");
  });

  it("affiche le compteur optionnel", () => {
    render(<Exemple />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("refuse d'être utilisé hors de son contexte", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() =>
      render(<Tabs.Panel value="x">Orphelin</Tabs.Panel>),
    ).toThrowError(/doit être utilisé à l'intérieur de <Tabs>/);

    spy.mockRestore();
  });
});
