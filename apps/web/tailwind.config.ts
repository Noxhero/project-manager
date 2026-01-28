import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7fb",
          100: "#eaedf7",
          200: "#cfd7ef",
          300: "#aab8e3",
          400: "#7f93d5",
          500: "#5b6ec6",
          600: "#4656a6",
          700: "#364281",
          800: "#26305c",
          900: "#161d38"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
