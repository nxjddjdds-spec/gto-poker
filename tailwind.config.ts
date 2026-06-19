import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gto: {
          green: "#22c55e",
          yellow: "#eab308",
          red: "#ef4444",
          blue: "#3b82f6",
          purple: "#a855f7",
          bg: "#0f1117",
          card: "#1a1d27",
          border: "#2a2d37",
          muted: "#8b8fa3",
        }
      }
    },
  },
  plugins: [],
};
export default config;
