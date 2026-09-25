"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { currentScrollKey, readScrollPosition, saveScrollPosition } from "@/lib/scroll-position";
import { getSmoothScrollPosition, scrollWithLenis, subscribeToSmoothScroll } from "./ScrollSystem";

export function ScrollPositionManager() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => { history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    let saved = readScrollPosition(currentScrollKey());
    let restoring = Boolean(saved);
    let leaving = false;
    let frame = 0;
    let saveTimer: ReturnType<typeof setTimeout> | undefined;
    let stableSince = 0;
    let started = performance.now();
    const remember = () => {
      if (restoring || leaving || location.pathname !== pathname) return;
      const homeReady = Boolean(document.querySelector('[data-home-ready="true"]'));
      if (pathname === "/" && !homeReady) return;
      saveScrollPosition(currentScrollKey(), { y: getSmoothScrollPosition(), homeReady });
    };
    const restore = () => {
      if (!saved || !restoring) return;
      const home = document.querySelector('.amo-experience');
      const ready = !home || home.getAttribute('data-scroll-ready') === 'true';
      const enoughHeight = document.documentElement.scrollHeight - innerHeight >= saved.y - 2;
      if (ready && enoughHeight) {
        if (Math.abs(getSmoothScrollPosition() - saved.y) > 2) {
          scrollWithLenis(saved.y);
          stableSince = 0;
        } else if (!stableSince) stableSince = performance.now();
        if (stableSince && performance.now() - stableSince > 450) restoring = false;
      }
      if (performance.now() - started > 8000) restoring = false;
      if (restoring) frame = requestAnimationFrame(restore);
    };
    const depart = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const destination = new URL(anchor.href, location.href);
      if (destination.origin !== location.origin || destination.pathname === pathname) return;
      // Explicit navigation wins over a pending restore, including after resize.
      restoring = false;
      cancelAnimationFrame(frame);
      remember();
      leaving = true;
    };
    const onHistory = () => {
      leaving = location.pathname !== pathname;
      if (leaving) return;
      cancelAnimationFrame(frame);
      saved = readScrollPosition(currentScrollKey());
      restoring = Boolean(saved);
      stableSince = 0;
      started = performance.now();
      if (restoring) frame = requestAnimationFrame(restore);
    };
    const cancelRestore = () => { restoring = false; cancelAnimationFrame(frame); };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) cancelRestore();
    };
    if (saved) frame = requestAnimationFrame(restore);
    const unsubscribe = subscribeToSmoothScroll(() => {
      if (saveTimer !== undefined) return;
      saveTimer = setTimeout(() => { saveTimer = undefined; remember(); }, 150);
    });
    document.addEventListener('click', depart, true);
    window.addEventListener('popstate', onHistory);
    window.addEventListener('pageshow', onHistory);
    window.addEventListener('pagehide', remember);
    window.addEventListener('wheel', cancelRestore, { passive: true });
    window.addEventListener('touchstart', cancelRestore, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      clearTimeout(saveTimer);
      document.removeEventListener('click', depart, true);
      window.removeEventListener('popstate', onHistory);
      window.removeEventListener('pageshow', onHistory);
      window.removeEventListener('pagehide', remember);
      window.removeEventListener('wheel', cancelRestore);
      window.removeEventListener('touchstart', cancelRestore);
      window.removeEventListener('keydown', onKey);
    };
  }, [pathname]);
  return null;
}
