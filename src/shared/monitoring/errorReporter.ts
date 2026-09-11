interface ErrorContext {
  componentStack?: string | null;
  userId?: string | number | null;
  route?: string;
}

const endpoint = import.meta.env.VITE_ERROR_REPORTING_URL as string | undefined;

export function reportError(error: Error, context: ErrorContext = {}) {
  console.error("Erreur applicative :", error, context);

  if (!endpoint || typeof navigator === "undefined") {
    return;
  }

  void fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    }),
    keepalive: true,
  }).catch(() => undefined);
}
