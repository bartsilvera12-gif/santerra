import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        santerra: {
          red: "#C52A42",
          "red-dark": "#9E1F33",
          graphite: "#151C23",
          black: "#0A0E12",
          gray: "#F1F3F5",
          "gray-mid": "#6B7580",
          "gray-line": "#E4E8EC"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"]
      },
      transitionTimingFunction: {
        "santerra": "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};
export default config;
