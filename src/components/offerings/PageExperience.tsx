"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SCROLL_SCRUB } from "@/lib/scroll-animation";
import styles from "./PageExperience.module.css";

export function PageExperience({ children, variant }: { children: ReactNode; variant: "work" | "studio" | "about" | "contact" }) {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const root = ref.current;
      if (!root) return;
      gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: SCROLL_SCRUB } });
      root.querySelectorAll<HTMLElement>("[data-page-reveal], article, section > div:first-child").forEach((element) => {
        // Leave interactive form fields visible and usable throughout scrolling.
        if (element.querySelector("form") || element.closest("form")) return;
        gsap.fromTo(element, { y: 32, opacity: 0.25 }, {
          y: 0, opacity: 1, ease: "none",
          scrollTrigger: { trigger: element, start: "top 96%", end: "top 72%", scrub: SCROLL_SCRUB },
        });
      });
      root.querySelectorAll<HTMLImageElement>("section img").forEach(image => {
        gsap.fromTo(image, { y: 24, scale: .96 }, { y: -12, scale: 1, ease: "none",
          scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: SCROLL_SCRUB } });
      });
    });
    return () => media.revert();
  }, []);
  return <div ref={ref} className={styles.experience} data-page={variant}><div ref={progressRef} className={styles.readingProgress} aria-hidden="true" />{children}</div>;
}
