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
        soft: "0 20px 55px rgba(7, 26, 63, 0.06)",
        premium: "0 20px 40px rgba(14,165,164,0.08), 0 6px 18px rgba(7,26,63,0.06)"
      },
      colors: {
        primary: {
          DEFAULT: "#0EA5A4",
          50: "#E6FBFA",
          100: "#CFF7F6",
          500: "#0ea5a4",
          600: "#0b8f8e"
        },
        sky: {
          DEFAULT: "#0369A1"
        },
        navy: {
          DEFAULT: "#071A3F"
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
