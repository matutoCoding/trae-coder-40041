/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        industrial: {
          bg: "#1A1D24",
          bgLight: "#242832",
          bgCard: "#2A2F3A",
          border: "#3A4050",
          borderLight: "#4A5264",
          orange: "#FF6B00",
          orangeDark: "#E65C00",
          steel: "#2A4A6B",
          steelLight: "#3A6A9B",
          warning: "#FFC107",
          success: "#00C853",
          alarm: "#D50000",
          text: "#E8EAEF",
          textSecondary: "#A0A6B3",
          textMuted: "#6B7280",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "industrial": "0 4px 20px rgba(0, 0, 0, 0.4)",
        "glow-orange": "0 0 20px rgba(255, 107, 0, 0.5)",
        "glow-green": "0 0 12px rgba(0, 200, 83, 0.6)",
        "glow-red": "0 0 12px rgba(213, 0, 0, 0.6)",
        "glow-yellow": "0 0 12px rgba(255, 193, 7, 0.6)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "flow": "flow 3s linear infinite",
        "blink": "blink 1s step-end infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 12px currentColor" },
          "50%": { opacity: "0.6", boxShadow: "0 0 24px currentColor" },
        },
        "flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
