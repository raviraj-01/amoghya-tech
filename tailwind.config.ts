import type { Config } from "tailwindcss";
import { tokens } from "./src/styles/tokens";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: tokens.colors.brand,
        surface: tokens.colors.surface,
        content: tokens.colors.text,
        border: tokens.colors.border,
        status: tokens.colors.status,
      },
      fontFamily: {
        sans: [tokens.typography.fontFamily.sans],
        mono: [tokens.typography.fontFamily.mono],
      },
      fontSize: tokens.typography.fontSize,
      borderRadius: tokens.radii,
      boxShadow: tokens.shadows,
      transitionDuration: {
        fast: "150ms",
        default: "250ms",
        smooth: "400ms",
      },
      maxWidth: {
        container: tokens.spacing.container,
      },
      height: {
        nav: tokens.spacing.navHeight,
      },
    },
  },
  plugins: [],
};

export default config;
