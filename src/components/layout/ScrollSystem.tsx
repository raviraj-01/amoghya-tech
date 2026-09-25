"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SCROLL_SCRUB } from "@/lib/scroll-animation";

gsap.registerPlugin(ScrollTrigger);

let activeLenis: Lenis | null = null;
const scrollSubscribers = new Set<() => void>();
let scrollLocks = 0;

declare global {
  interface Window { __vatLenis?: Lenis; }
}

export const subscribeToSmoothScroll = (callback: () => void) => {
  scrollSubscribers.add(callback);
  return () => { scrollSubscribers.delete(callback); };
};

export const lockSmoothScroll = () => {
  scrollLocks += 1;
  activeLenis?.stop();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLocks = Math.max(0, scrollLocks - 1);
    if (!scrollLocks) activeLenis?.start();
  };
};

export const getSmoothScrollPosition = () => activeLenis?.scroll ?? (typeof document === "undefined" ? 0 : document.documentElement.scrollTop);
export const scrollWithLenis = (top: number) => {
  if (activeLenis) activeLenis.scrollTo(top, { immediate: true });
  else window.scrollTo(0, top);
};

export function ScrollSystem() {
  useLayoutEffect(() => {
    if (activeLenis) {
      console.warn("[scroll] Duplicate ScrollSystem mount ignored.");
      return;
    }
    // Lenis owns input smoothing; the earlier native normalizer must stay off.
    ScrollTrigger.normalizeScroll(false);
    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.7,
      touchMultiplier: 0.8,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.075,
      autoRaf: false,
      anchors: { offset: -110 },
      stopInertiaOnNavigate: true,
    });
    activeLenis = lenis;
    if (scrollLocks) lenis.stop();
    if (process.env.NODE_ENV !== "production") {
      window.__vatLenis = lenis;
      console.debug("[scroll] One active Lenis instance", lenis);
    }
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
      scrollSubscribers.forEach(callback => callback());
    };
    const raf = (time: number) => lenis.raf(time * 1000);

    ScrollTrigger.defaults({ scrub: SCROLL_SCRUB });
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = null;
      if (window.__vatLenis === lenis) delete window.__vatLenis;
    };
  }, []);
  return null;
}
