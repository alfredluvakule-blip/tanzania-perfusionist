import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef3fb", 100: "#d6e1f3", 200: "#adc3e7", 300: "#7d9dd4",
          400: "#4f74bb", 500: "#30559e", 600: "#22417f", 700: "#1a3263",
          800: "#122449", 900: "#0b1733", 950: "#060d1f",
        },
        teal: {
          50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9",
          400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490",
          800: "#155e75", 900: "#164e63",
        },
        pulse: {
          300: "#fca5a5", 400: "#f87171", 500: "#e11d48", 600: "#be123c", 700: "#9f1239",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(34,211,238,0.45)",
        card: "0 1px 2px rgba(11,23,51,0.06), 0 8px 24px -12px rgba(11,23,51,0.18)",
      },
      keyframes: {
        flow: { to: { strokeDashoffset: "-200" } },
        beat: {
          "0%,100%": { transform: "scale(1)" },
          "15%": { transform: "scale(1.08)" },
          "30%": { transform: "scale(0.98)" },
          "45%": { transform: "scale(1.04)" },
        },
        spinSlow: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        flow: "flow 6s linear infinite",
        beat: "beat 1.6s ease-in-out infinite",
        "spin-slow": "spinSlow 4s linear infinite",
      },
    },
  },
  plugins: [typography],
};
export default config;
