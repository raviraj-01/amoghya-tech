/**
 * Quality & Experience Controller
 * Reference: TRD_3D_PERFORMANCE.md Section 5 and Section 7
 */

import { create } from "zustand";
import { QualityTier } from "@/types";
import { detectQualityTier } from "./tier-detection";

interface ExperienceState {
  tier: QualityTier;
  enable3D: boolean;
  enableSound: boolean;
  isInitialized: boolean;
  lowFpsCount: number;

  // Actions
  initialize: () => void;
  setTier: (tier: QualityTier) => void;
  toggle3D: () => void;
  toggleSound: () => void;
  recordFrameMetric: (fps: number) => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  tier: 0,
  enable3D: true,
  enableSound: false,
  isInitialized: false,
  lowFpsCount: 0,

  initialize: () => {
    if (typeof window === "undefined") return;

    const detected = detectQualityTier();
    const stored3D = localStorage.getItem("vat_enable_3d");
    const storedSound = localStorage.getItem("vat_enable_sound");

    const enable3D = stored3D !== null ? stored3D === "true" : detected > 0;
    const enableSound = storedSound !== null ? storedSound === "true" : false;

    set({
      tier: enable3D ? detected : 0,
      enable3D,
      enableSound,
      isInitialized: true,
    });
  },

  setTier: (tier: QualityTier) => set({ tier }),

  toggle3D: () => {
    const nextVal = !get().enable3D;
    const nextTier = nextVal ? detectQualityTier() : 0;
    if (typeof window !== "undefined") {
      localStorage.setItem("vat_enable_3d", String(nextVal));
    }
    set({ enable3D: nextVal, tier: nextTier });
  },

  toggleSound: () => {
    const nextVal = !get().enableSound;
    if (typeof window !== "undefined") {
      localStorage.setItem("vat_enable_sound", String(nextVal));
    }
    set({ enableSound: nextVal });
  },

  // Auto downgrade rule: if device drops below target fps for consecutive checks, downgrade tier
  recordFrameMetric: (fps: number) => {
    const { tier, lowFpsCount } = get();
    if (tier === 0) return;

    const threshold = tier === 2 ? 45 : 25;
    if (fps < threshold) {
      const nextCount = lowFpsCount + 1;
      if (nextCount >= 2) {
        // Auto downgrade to next lower tier
        const newTier = (tier - 1) as QualityTier;
        set({ tier: newTier, lowFpsCount: 0 });
      } else {
        set({ lowFpsCount: nextCount });
      }
    } else {
      if (lowFpsCount > 0) set({ lowFpsCount: 0 });
    }
  },
}));
