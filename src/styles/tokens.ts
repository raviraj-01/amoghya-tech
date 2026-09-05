/**
 * Design Tokens — Vyara Amogya Technologies
 * Single source of truth for color palette, typography, spacing, radii, and shadows.
 * Matches PRD §1, §6, and TRD §1.
 */

export const tokens = {
  colors: {
    // Brand Core
    brand: {
      primary: "#000000",
      secondary: "#C8FF3D",
      accent: "#C8FF3D",
      highlight: "#C8FF3D",
    },
    // Backgrounds & Surface
    surface: {
      base: "#EDEDEB",
      elevated: "#FFFFFF",    // Pure white for cards/modals
      muted: "#E3E3E1",
      dark: "#000000",
      darkElevated: "#111111",
    },
    // Typography / Text Colors
    text: {
      primary: "#000000",
      secondary: "rgba(0, 0, 0, 0.68)",
      muted: "rgba(0, 0, 0, 0.42)",
      inverted: "#FFFFFC",
      invertedMuted: "rgba(255, 255, 252, 0.68)",
    },
    // Borders & Dividers
    border: {
      subtle: "rgba(0, 0, 0, 0.08)",
      default: "rgba(0, 0, 0, 0.14)",
      strong: "rgba(0, 0, 0, 0.25)",
      darkSubtle: "rgba(255, 255, 252, 0.12)",
      darkDefault: "rgba(255, 255, 252, 0.2)",
    },
    // Semantic Status
    status: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  },
  typography: {
    fontFamily: {
      sans: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      mono: "var(--font-mono, 'JetBrains Mono', monospace)",
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }] as [string, { lineHeight: string }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }] as [string, { lineHeight: string }],
      base: ["1rem", { lineHeight: "1.5rem" }] as [string, { lineHeight: string }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }] as [string, { lineHeight: string }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }] as [string, { lineHeight: string }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }] as [string, { lineHeight: string }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }] as [string, { lineHeight: string }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }] as [string, { lineHeight: string }],
      "5xl": ["3rem", { lineHeight: "1.16" }] as [string, { lineHeight: string }],
      "6xl": ["3.75rem", { lineHeight: "1.1" }] as [string, { lineHeight: string }],
    },
  },
  spacing: {
    container: "1280px",
    navHeight: "4.5rem",
  },
  radii: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },
  shadows: {
    subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    card: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    elevated: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
    glow: "0 0 25px rgba(200, 255, 61, 0.35)",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    default: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
    smooth: "400ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
};

export type DesignTokens = typeof tokens;
