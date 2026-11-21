import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F2E7D7",
          50: "#FBF6EC",
          100: "#F7EFE3",
          200: "#EDDFCB",
          300: "#E2CEB1",
        },
        cocoa: {
          DEFAULT: "#2B1A12",
          700: "#4A2E20",
          600: "#5C3B2A",
        },
        choco: {
          DEFAULT: "#633D29",
          700: "#4E2F1F",
          800: "#3B2216",
          900: "#2A1810",
        },
        caramel: {
          DEFAULT: "#D9AD75",
          200: "#F0DFC4",
          300: "#E7CBA2",
          400: "#DFBB8B",
          500: "#C68F4E",
          600: "#B57C3C",
        },
        milk: "#FFFCF6",
        velvet: "#8E3B33",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 30px 70px -35px rgba(43, 26, 18, 0.45)",
        card: "0 1px 2px rgba(43, 26, 18, 0.05), 0 22px 48px -32px rgba(43, 26, 18, 0.45)",
        lift: "0 34px 70px -40px rgba(43, 26, 18, 0.55)",
        glow: "0 22px 44px -22px rgba(99, 61, 41, 0.6)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "fade-up": "fade-up 0.65s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        sway: "sway 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
