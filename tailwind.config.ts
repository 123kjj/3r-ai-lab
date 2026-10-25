import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // "paper" kept as a flat value for backward-compat with
        // existing components; "paper-50/100" are the field-journal
        // redesign's warm ivory ramp.
        paper: "#FBF8F1",
        "paper-50": "#FBF8F1",
        "paper-100": "#F4EEDF",
        // "forest" is the redesign's primary palette (spec: "forest
        // green and charcoal"). "moss" is kept as an alias pointing to
        // the same ramp so components not yet migrated to the new
        // class names keep rendering correctly.
        forest: {
          50: "#F0F4ED",
          100: "#DEE8D7",
          200: "#C0D4B3",
          300: "#9CBB89",
          400: "#729A5E",
          500: "#4C7A3C",
          600: "#3A6A2E",
          700: "#2D5323",
          800: "#1E3818",
          900: "#15270F",
        },
        moss: {
          50: "#F2F7F0",
          100: "#E2EEDD",
          200: "#C4DDBB",
          300: "#9FC792",
          400: "#75AC66",
          500: "#4F8C42",
          600: "#3B7132",
          700: "#2E5B28",
          800: "#1F3D1C",
          900: "#152912",
        },
        charcoal: {
          50: "#F5F4F2",
          100: "#E6E4E0",
          200: "#CBC7C0",
          300: "#A6A099",
          400: "#7D7870",
          500: "#5B5750",
          600: "#454238",
          700: "#322F28",
          800: "#242219",
          900: "#19170F",
        },
        soil: {
          50: "#FAF3E7",
          100: "#F1E6D3",
          300: "#DEC08A",
          500: "#B98A3E",
          700: "#8A6329",
          800: "#6E4F20",
          900: "#4E3617",
        },
        ink: "#1C1E1A",
      },
      fontFamily: {
        // Editorial serif for major headings, clean sans for interface
        // and data — both class name families are kept so older
        // components (font-display/font-body) and new ones
        // (font-serif/font-sans) both resolve to the same loaded fonts.
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        blob: "42% 58% 63% 37% / 41% 45% 55% 59%",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(31, 61, 28, 0.06), 0 10px 30px rgba(31, 61, 28, 0.05)",
        lift: "0 8px 24px rgba(31, 61, 28, 0.12)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "sway": {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.5s ease-out both",
        "pop": "pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
        "sway": "sway 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
