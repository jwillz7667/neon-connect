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
          DEFAULT: "#E535FF",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#8B00FF",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FF1744",
          foreground: "#000000",
        },
        neon: {
          cyan: "#00FFFF",
          magenta: "#E535FF",
          red: "#FF1744",
          blue: "#0080FF",
          purple: "#8B00FF",
        },
        'neon-red': '#FF1744',
        'neon-magenta': '#E535FF',
        'neon-purple': '#8B00FF',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "neon-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 7px var(--neon-color), 0 0 10px var(--neon-color), 0 0 21px var(--neon-color)",
            textShadow: "0 0 7px var(--neon-color), 0 0 10px var(--neon-color), 0 0 21px var(--neon-color)"
          },
          "50%": { 
            boxShadow: "0 0 14px var(--neon-color), 0 0 20px var(--neon-color), 0 0 42px var(--neon-color)",
            textShadow: "0 0 14px var(--neon-color), 0 0 20px var(--neon-color), 0 0 42px var(--neon-color)"
          },
        },
        "neon-flicker": {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": { opacity: "0.99" },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.4" },
        },
        "glass-shine": {
          "0%": { transform: "translateX(-100%)" },
          "50%, 100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "neon-flicker": "neon-flicker 4s linear infinite",
        "glass-shine": "glass-shine 2s linear infinite",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #000000 0%, rgba(139, 0, 255, 0.2) 100%)",
        "glass-gradient": "linear-gradient(120deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;