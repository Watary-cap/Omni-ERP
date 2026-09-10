import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("rend la valeur initiale immédiatement", () => {
    const { result } = renderHook(() => useDebounce("a", 300));

    expect(result.current).toBe("a");
  });

  it("ne propage pas la nouvelle valeur avant le délai", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => void vi.advanceTimersByTime(299));

    expect(result.current).toBe("a");
  });

  it("propage la valeur une fois le délai écoulé", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => void vi.advanceTimersByTime(300));

    expect(result.current).toBe("b");
  });

  it("seule la dernière frappe d'une rafale est retenue", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    act(() => void vi.advanceTimersByTime(100));

    rerender({ value: "abc" });
    act(() => void vi.advanceTimersByTime(100));

    rerender({ value: "abcd" });
    act(() => void vi.advanceTimersByTime(300));

    expect(result.current).toBe("abcd");
  });
});
