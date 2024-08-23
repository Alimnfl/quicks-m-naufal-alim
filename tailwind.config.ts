import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
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
      },
    },
  },
  plugins: [],
};
export default config;
