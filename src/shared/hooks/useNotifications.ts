import { useCallback, useEffect, useState } from "react";

import { appEvents, type Notification } from "../patterns/eventBus";

/**
 * Consomme l'émetteur d'événements : le hook s'abonne au montage et se
 * désabonne au démontage, ce qui évite toute fuite de listener.
 */
export function useNotifications(autoDismissMs = 4000) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = appEvents.subscribe("notification", (notification) => {
      setNotifications((current) => [...current, notification]);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (notifications.length === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setNotifications((current) => current.slice(1));
    }, autoDismissMs);

    return () => clearTimeout(timeout);
  }, [notifications, autoDismissMs]);

  /* Référence stable : sans elle, la mémoïsation des éléments de la
     liste serait annulée à chaque rendu du parent. */
  const dismiss = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  return { notifications, dismiss };
}
