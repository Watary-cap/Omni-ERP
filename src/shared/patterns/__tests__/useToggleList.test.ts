import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useToggleList } from "../useToggleList";

describe("useToggleList (state reducer)", () => {
  it("ajoute puis retire une valeur", () => {
    const { result } = renderHook(() => useToggleList());

    act(() => result.current.toggle("a"));
    expect(result.current.selected).toEqual(["a"]);

    act(() => result.current.toggle("a"));
    expect(result.current.selected).toEqual([]);
  });

  it("select n'ajoute jamais de doublon", () => {
    const { result } = renderHook(() => useToggleList(["a"]));

    act(() => result.current.select("a"));

    expect(result.current.selected).toEqual(["a"]);
  });

  it("vide la sélection", () => {
    const { result } = renderHook(() => useToggleList(["a", "b"]));

    act(() => result.current.clear());

    expect(result.current.selected).toEqual([]);
  });

  it("laisse l'appelant plafonner la sélection sans réécrire la logique", () => {
    const { result } = renderHook(() =>
      useToggleList([], (state, action, proposed) =>
        action.type === "toggle" && proposed.length > 2 ? state : proposed,
      ),
    );

    act(() => result.current.toggle("a"));
    act(() => result.current.toggle("b"));
    act(() => result.current.toggle("c"));

    // Le troisième ajout est refusé par le reducer de l'appelant
    expect(result.current.selected).toEqual(["a", "b"]);
  });

  it("expose isSelected", () => {
    const { result } = renderHook(() => useToggleList(["a"]));

    expect(result.current.isSelected("a")).toBe(true);
    expect(result.current.isSelected("b")).toBe(false);
  });
});
