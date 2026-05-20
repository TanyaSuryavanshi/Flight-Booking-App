import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./store/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica Neue", "Arial"]
      },
      boxShadow: {
        soft: "0 20px 55px rgba(15, 23, 42, 0.08)",
        premium: "0 20px 40px rgba(56, 189, 248, 0.08), 0 6px 18px rgba(15, 23, 42, 0.06)"
      },
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#eef7ff",
          100: "#d9ecff",
          500: "#2563eb",
          600: "#1d4ed8"
        },
        sky: {
          DEFAULT: "#38BDF8"
        },
        navy: {
          DEFAULT: "#0F172A"
        },
        bg: {
          DEFAULT: "#F8FAFC"
        },
        success: {
          DEFAULT: "#22C55E"
        },
        danger: {
          DEFAULT: "#EF4444"
        }
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.25rem",
        '3xl': "1.75rem"
      }
    }
  },
  plugins: []
};

export default config;
