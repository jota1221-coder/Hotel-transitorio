import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  "#F2EDE5",
          100: "#D6CFC4",
          200: "#9F968A",
          300: "#6E665C",
          400: "#3D3833",
          500: "#1F1B17",
          600: "#15110F",
          700: "#0E0B0A",
          800: "#080706",
          900: "#040303",
          950: "#020201"
        },
        wine: {
          50:  "#FCF3F5",
          100: "#F3D8DD",
          200: "#E2A4B0",
          300: "#C97082",
          400: "#A94659",
          500: "#7A1F32",
          600: "#5B1525",
          700: "#3F0F1A",
          800: "#260910",
          900: "#140509"
        },
        gold: {
          50:  "#FBF6EC",
          100: "#F3E5C7",
          200: "#E5C98E",
          300: "#D5AC5E",
          400: "#B98D3F",
          500: "#8E6A2C",
          600: "#6A4E1F"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"]
      },
      letterSpacing: {
        widest: "0.25em"
      },
      animation: {
        "fade-up": "fadeUp 0.9s cubic-bezier(0.25, 1, 0.5, 1) forwards"
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
