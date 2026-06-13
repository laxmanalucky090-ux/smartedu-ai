/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          50:  "#f0f4ff",
          100: "#e0e8ff",
          200: "#c7d5fe",
          300: "#a5b8fc",
          400: "#8194f8",
          500: "#6271f1",
          600: "#4e51e5",
          700: "#3e3dca",
          800: "#3433a4",
          900: "#2f3083",
          950: "#1c1b4e",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        surface: {
          DEFAULT: "#0f0f1a",
          card:    "#16162a",
          border:  "#2a2a45",
        },
      },
      backgroundImage: {
        "grid-ink": "radial-gradient(circle, #6271f122 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-sm": "28px 28px",
      },
      animation: {
        "fade-up":   "fadeUp 0.5s ease forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(18px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
