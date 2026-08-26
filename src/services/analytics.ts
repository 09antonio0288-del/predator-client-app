import type { AnalyticsEvent, AnalyticsEventName } from "@/types";

export function trackEvent(
  name: AnalyticsEventName,
  payload?: Record<string, string | number | boolean>
): AnalyticsEvent {
  const event: AnalyticsEvent = {
    id: crypto.randomUUID(),
    name,
    payload,
    at: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      const key = "predator-analytics-v1";
      const prev = JSON.parse(localStorage.getItem(key) || "[]") as AnalyticsEvent[];
      localStorage.setItem(key, JSON.stringify([event, ...prev].slice(0, 200)));
    } catch {
      // ignore quota
    }
  }
  return event;
}
