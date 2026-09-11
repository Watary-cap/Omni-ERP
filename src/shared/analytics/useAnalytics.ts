import { useCallback } from "react";

interface AnalyticsEvent {
  event: string;
  parameters?: Record<string, string | number | boolean>;
}

export function trackEvent({ event, parameters = {} }: AnalyticsEvent) {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", event, parameters);
}

export function useAnalytics() {
  const track = useCallback(
    (event: string, parameters?: Record<string, string | number | boolean>) =>
      trackEvent({ event, parameters }),
    [],
  );

  const trackPageView = useCallback((pagePath: string) => {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("event", "page_view", { page_path: pagePath });
  }, []);

  return { track, trackPageView };
}
