import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#D946EF",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#60A5FA",
          foreground: "#000000",
        },
        neon: {
          pink: "#D946EF",
          purple: "#8B5CF6",
          blue: "#60A5FA",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "glow": {
          "0%, 100%": { boxShadow: "0 0 15px #D946EF" },
          "50%": { boxShadow: "0 0 30px #D946EF" },
        },
      },
      animation: {
        "glow": "glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #000000 0%, #D946EF 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;