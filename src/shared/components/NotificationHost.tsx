import { memo, useCallback } from "react";
import { createPortal } from "react-dom";

import { useNotifications } from "../hooks/useNotifications";

import type { Notification } from "../patterns/eventBus";

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

/* Mémoïsé : l'arrivée d'une notification ne doit pas re-rendre celles
   déjà affichées. `onDismiss` est stabilisé par useCallback côté parent. */
const NotificationItem = memo(function NotificationItem({
  notification,
  onDismiss,
}: NotificationItemProps) {
  return (
    <div className={`notification notification-${notification.tone}`}>
      <span>{notification.message}</span>

      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        aria-label="Masquer la notification"
      >
        ×
      </button>
    </div>
  );
});

/**
 * Affiche les notifications émises par l'event bus. Rendu dans un portail
 * pour rester au-dessus de toute la mise en page.
 */
export default function NotificationHost() {
  const { notifications, dismiss } = useNotifications();

  const handleDismiss = useCallback(
    (id: string) => dismiss(id),
    [dismiss],
  );

  if (notifications.length === 0) {
    return null;
  }

  return createPortal(
    <div className="notification-host" role="status" aria-live="polite">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={handleDismiss}
        />
      ))}
    </div>,
    document.body,
  );
}
