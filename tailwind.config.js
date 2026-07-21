/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Sports Hub brand — "dispatch manifest" palette
        navy: {
          DEFAULT: "#10192C",
          ink: "#0A0F1C",
          50: "#EEF1F7",
          100: "#D6DCEA",
          200: "#AEB9D4",
          300: "#8595BC",
          400: "#5C71A3",
          500: "#3E5288",
          600: "#293A69",
          700: "#1B2A4A",
          800: "#141F38",
          900: "#10192C",
        },
        amber: {
          DEFAULT: "#F2A93B",
          50: "#FEF6E9",
          100: "#FCE9C7",
          200: "#F9D28F",
          300: "#F6BC5C",
          400: "#F2A93B",
          500: "#DE8E1A",
          600: "#B87113",
          700: "#8F5710",
        },
        safety: {
          green: "#2E8B4F",
          greenLight: "#E6F4EA",
          red: "#C4432E",
          redLight: "#FBEAE6",
        },
        paper: "#F7F6F2",
        ink: "#141A24",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
        editorial: ["'Fraunces'", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,25,44,0.06), 0 1px 12px rgba(16,25,44,0.05)",
        lift: "0 8px 24px rgba(16,25,44,0.12)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        fadeUp: { "0%": { opacity: 0, transform: "translateY(10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        slideDown: { "0%": { opacity: 0, transform: "translateY(-8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-500px 0" }, "100%": { backgroundPosition: "500px 0" } },
        scaleIn: { "0%": { opacity: 0, transform: "scale(0.96)" }, "100%": { opacity: 1, transform: "scale(1)" } },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out both",
        fadeUp: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        slideDown: "slideDown 0.25s ease-out both",
        scaleIn: "scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
