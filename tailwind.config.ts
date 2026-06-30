import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Page + surfaces
        canvas: "#2b2933",
        ink: "#2c2a44", // dark text on light cards
        lavender: {
          DEFAULT: "#eceafb",
          deep: "#e0dcf8",
        },
        // Brand violet
        brand: {
          50: "#f1edff",
          100: "#e3dbff",
          200: "#c8b6ff",
          300: "#a78bff",
          400: "#8b66f7",
          500: "#6c3fe8",
          600: "#5a30d6",
          700: "#4a25b3",
          DEFAULT: "#5a30d6",
        },
        accent: {
          cyan: "#2bd4e6",
          teal: "#34d8be",
          green: "#3fae57",
        },
      },
      borderRadius: {
        bento: "1.75rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        bento: "0 18px 40px -24px rgba(0,0,0,0.55)",
        glow: "0 14px 40px -12px rgba(108,63,232,0.55)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
