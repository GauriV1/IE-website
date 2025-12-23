import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        whitman: {
          navy: "#003366",
          blue: "#0066CC",
          lightblue: "#E6F2FF",
          gold: "#D4AF37",
          gray: "#4A4A4A",
        },
      },
    },
  },
  plugins: [],
};
export default config;

