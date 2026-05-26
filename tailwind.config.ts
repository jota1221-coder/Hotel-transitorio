import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta Ruta Hotel — navy profundo + rose vibrante
        night: {
          50:  "#E8ECF3",
          100: "#C5CDDE",
          200: "#8A9AB8",
          300: "#5F7090",
          400: "#3A4A6B",
          500: "#1F2D4D",
          600: "#152038",
          700: "#0E1828",
          800: "#0A1424",
          900: "#060D1A",
          950: "#03070F"
        },
        // Rose vibrante — matchea LEDs rojos de habitaciones y logo
        rose: {
          50:  "#FFF1F5",
          100: "#FFE0E9",
          200: "#FFBDD0",
          300: "#FF8AAE",
          400: "#FF5588",
          500: "#E83467",   // principal CTA
          600: "#C2204E",
          700: "#8F1738",
          800: "#5C0E24",
          900: "#2F0712"
        }
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        script: ["'Great Vibes'", "cursive"]
      },
      letterSpacing: {
        widest: "0.25em"
      }
    }
  },
  plugins: []
};

export default config;
