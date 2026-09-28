import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1013",
        "bg-soft": "#0F1013",
        text: "#E1E3E4",
        "text-dim": "#BBC6CF",
        "text-faint": "#4C5665",
        accent: "#920513",
        "accent-soft": "#F4AEA8",
        line: "#4C5665",
        panel: "#0F1013",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
