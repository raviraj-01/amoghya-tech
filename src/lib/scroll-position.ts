const PREFIX = "vat:scroll:";
let initialNavigationChecked = false;
export type ScrollPosition = { y: number; homeReady: boolean };

export function currentScrollKey() {
  return location.pathname + location.search + location.hash;
}

export function readScrollPosition(key: string): ScrollPosition | null {
  try {
    // Run once per document, not per route mount: Back and SPA returns must resume.
    if (!initialNavigationChecked) {
      initialNavigationChecked = true;
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (location.pathname === "/" && !location.hash && navigation?.type !== "back_forward") {
        sessionStorage.removeItem(PREFIX + currentScrollKey());
      }
    }
    const value = JSON.parse(sessionStorage.getItem(PREFIX + key) || "null");
    return value && Number.isFinite(value.y) && value.y >= 0 && typeof value.homeReady === "boolean" ? value : null;
  } catch { return null; }
}

export function saveScrollPosition(key: string, value: ScrollPosition) {
  try { sessionStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ }
}
