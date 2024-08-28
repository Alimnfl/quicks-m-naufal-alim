import type { Config } from "tailwindcss";

const config = {
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          1: "#2F80ED", // Blue
          2: "#4F4F4F", // Dark Gray
          3: "#828282", // Medium Gray
          4: "#E0E0E0", // Light Gray
        },
        indicator: {
          1: "#F8B76B", // Orange
          2: "#8785FF", // Light Purple
          3: "#EB5757", // Red
          4: "#F2C94C", // Yellow
        },
        chat: {
          1: "#E5A443", // A warm golden or amber color.
          1.1: "#FCEED3", // A light peach color.
          2: "#9B51E0", // A vibrant purple color.
          2.1: "#EEDCFF", // A light lavender color.
          3: "#43B78D", // A teal or sea green color.
          3.1: "#D2F2EA", // A light aqua or mint color.
          4: "#EB5757", // A strong red color.
          4.1: "#FDE4E4", // A soft blush pink.
          5: "#2D9CDB", // A bright sky blue color.
          5.1: "#D5EFFF", // A light baby blue color.
          6: "#F2994A", // A rich orange color.
          6.1: "#FDE8D3", // A soft apricot color.
          7: "#27AE60", // A deep emerald green.
          7.1: "#D5F5E3", // A light mint green color.
          8: "#6C5CE7", // A royal purple color.
          8.1: "#E2D9FF", // A light lilac color.
          9: "#FF6F61", // A coral pink color.
          9.1: "#FFE6E3", // A soft peach color.
          10: "#56CCF2", // A bright cyan color.
          10.1: "#E1F5FE", // A light pastel blue.
        },
        sticker: {
          1: "#E9F3FF", // A very light sky blue color.
          2: "#FDCFA4", // A light orange or peach color.
          3: "#F9E9C3", // A light tan or beige color.
          4: "#AFEBDB", // A light mint green color.
          5: "#CBF1C2", // A soft green color.
          6: "#CFCEF9", // A pale lavender or light purple color.
          7: "#F9E0FD", // A very light pink color.
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
