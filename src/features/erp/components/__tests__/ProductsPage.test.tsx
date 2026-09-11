import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProductsPage from "../ProductsPage";
import { renderWithProviders } from "../../../../test/renderWithProviders";

describe("ProductsPage", () => {
  it("charge le catalogue local et permet de rechercher un produit", async () => {
    renderWithProviders(<ProductsPage />);

    expect(screen.getByText("Chargement du catalogue produits...")).toBeInTheDocument();

    expect(await screen.findByText("Pack design collaboratif")).toBeInTheDocument();
    expect(screen.getByText("Serveur cloud entreprise")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Rechercher un produit" }), {
      target: { value: "design" },
    });

    expect(screen.getByText("Pack design collaboratif")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Serveur cloud entreprise")).not.toBeInTheDocument();
    });
  });
});
