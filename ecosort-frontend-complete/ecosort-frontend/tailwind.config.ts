import type { Config } from "tailwindcss";

/**
 * Design tokens for EcoSort's admin UI. Restrained palette — zinc
 * neutrals plus one deliberate accent: an emerald/leaf green, chosen
 * for the eco-friendly waste-management domain, used sparingly for
 * primary actions, links, and focus states rather than throughout.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        popover: "0 4px 16px -2px rgb(0 0 0 / 0.08), 0 0 0 1px rgb(0 0 0 / 0.04)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
        "slide-up": "slide-up 0.15s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
