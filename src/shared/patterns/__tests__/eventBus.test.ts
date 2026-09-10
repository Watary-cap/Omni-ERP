import { describe, expect, it, vi } from "vitest";

import { EventBus } from "../eventBus";

interface TestEvents extends Record<string, unknown> {
  ping: { value: number };
}

describe("EventBus (observer)", () => {
  it("transmet la charge utile aux abonnés", () => {
    const bus = new EventBus<TestEvents>();
    const listener = vi.fn();

    bus.subscribe("ping", listener);
    bus.emit("ping", { value: 42 });

    expect(listener).toHaveBeenCalledWith({ value: 42 });
  });

  it("prévient tous les abonnés d'un même événement", () => {
    const bus = new EventBus<TestEvents>();
    const a = vi.fn();
    const b = vi.fn();

    bus.subscribe("ping", a);
    bus.subscribe("ping", b);
    bus.emit("ping", { value: 1 });

    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  it("le désabonnement rendu par subscribe coupe la réception", () => {
    const bus = new EventBus<TestEvents>();
    const listener = vi.fn();

    const unsubscribe = bus.subscribe("ping", listener);
    unsubscribe();

    bus.emit("ping", { value: 1 });

    expect(listener).not.toHaveBeenCalled();
  });

  it("émettre sans abonné ne lève pas d'erreur", () => {
    const bus = new EventBus<TestEvents>();

    expect(() => bus.emit("ping", { value: 1 })).not.toThrow();
  });
});
