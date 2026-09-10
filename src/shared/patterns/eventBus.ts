type Listener<T> = (payload: T) => void;

/**
 * Pattern observer : un émetteur minimal auquel des composants s'abonnent
 * sans se connaître. Sert de canal pour les notifications applicatives.
 */
export class EventBus<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<Listener<never>>>();

  subscribe<K extends keyof Events>(
    event: K,
    listener: Listener<Events[K]>,
  ): () => void {
    const current = this.listeners.get(event) ?? new Set();

    current.add(listener as Listener<never>);
    this.listeners.set(event, current);

    // La fonction rendue sert de cleanup dans useEffect
    return () => {
      current.delete(listener as Listener<never>);
    };
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners.get(event)?.forEach((listener) => {
      (listener as Listener<Events[K]>)(payload);
    });
  }

  clear(): void {
    this.listeners.clear();
  }
}

export interface Notification {
  id: string;
  message: string;
  tone: "info" | "success" | "error";
}

export interface AppEvents extends Record<string, unknown> {
  notification: Notification;
}

export const appEvents = new EventBus<AppEvents>();

export function notify(message: string, tone: Notification["tone"] = "info") {
  appEvents.emit("notification", {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
    tone,
  });
}
