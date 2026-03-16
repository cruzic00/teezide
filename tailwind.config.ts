import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#f3f4f6",
        accent: "#D4AF37",
        "accent-dark": "#B5952F",
      },
    },
  },
  plugins: [],
} satisfies Config;
