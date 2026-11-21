import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom pastel theme matching the screenshot
        pastel: {
          w1: "#C5D1E8", // Week 1 soft blue/lavender
          w1Dark: "#486581",
          w1Bar: "#6B8AFE",
          w2: "#F3C5D3", // Week 2 soft pink/rose
          w2Dark: "#9E3A59",
          w2Bar: "#D46187",
          w3: "#C4E2D5", // Week 3 soft sage/mint
          w3Dark: "#2B684F",
          w3Bar: "#4FA67B",
          w4: "#F8DCBA", // Week 4 soft peach/warm sand
          w4Dark: "#945B20",
          w4Bar: "#E0934A",
          checkNavy: "#1E2640",
          checkActive: "#243256",
          bgLight: "#F8FAFC",
          cardLight: "#FFFFFF",
          borderSoft: "#E2E8F0"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;

