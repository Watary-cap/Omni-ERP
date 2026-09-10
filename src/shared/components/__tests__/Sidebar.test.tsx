import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import Sidebar from "../Sidebar";

import { renderWithProviders } from "../../../test/renderWithProviders";

describe("<Sidebar />", () => {
  it("liste les sept espaces de travail", () => {
    renderWithProviders(<Sidebar />);

    for (const label of [
      "Dashboard",
      "Projets",
      "Employés",
      "Clients",
      "Produits",
      "Analytics",
      "Paramètres",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("marque comme actif le lien de la route courante", () => {
    renderWithProviders(<Sidebar />, { route: "/settings" });

    const lien = screen.getByText("Paramètres").closest("a");

    expect(lien).toHaveClass("active");
  });

  it("n'active qu'un seul lien à la fois", () => {
    const { container } = renderWithProviders(<Sidebar />, { route: "/crm" });

    expect(container.querySelectorAll(".sidebar-link.active")).toHaveLength(1);
    expect(screen.getByText("Clients").closest("a")).toHaveClass("active");
  });
});
