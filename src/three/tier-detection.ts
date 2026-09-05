/**
 * Quality Tier Detection
 * Reference: TRD_3D_PERFORMANCE.md Section 2
 *
 * Tier 0: No WebGL / reduced motion / very low memory (< 2GB) -> Static fallback only
 * Tier 1: Low/mid mobile -> Reduced geometry, baked lighting, capped pixel ratio (1.5x)
 * Tier 2: Desktop / high-end mobile -> Full scene detail, pointer tracking, rich shaders
 */

import { QualityTier } from "@/types";

let cachedTier: QualityTier | null = null;

export function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") {
    return 0; // SSR baseline
  }

  if (cachedTier !== null) {
    return cachedTier;
  }

  // 1. Check OS / user reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cachedTier = 0;
    return 0;
  }

  // 2. Check Device Memory API where supported
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) {
    cachedTier = 0;
    return 0;
  }

  // 3. Test WebGL context creation and clean up resources immediately
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (!gl) {
      cachedTier = 0;
      return 0;
    }

    // Clean up test context to prevent context leaks
    const loseContext = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_lose_context"
    );
    if (loseContext) {
      loseContext.loseContext();
    }
    canvas.remove();

    // 4. Mobile / Screen Check
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      window.innerWidth < 768 ||
      (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);

    if (isMobile) {
      cachedTier = 1;
      return 1;
    }

    cachedTier = 2;
    return 2;
  } catch {
    cachedTier = 0;
    return 0;
  }
}

