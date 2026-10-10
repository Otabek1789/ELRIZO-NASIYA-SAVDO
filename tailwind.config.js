/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#6C3EF4", dark: "#2A1466", light: "#B69CFF", soft: "#EFE8FF" },
        accent: { DEFAULT: "#E8622C", soft: "#FCE7DA" },
        good: { DEFAULT: "#1E8E5A", soft: "#E1F5EA" },
        bad: { DEFAULT: "#D33C3C", soft: "#FBE4E4" },
        surface: { DEFAULT: "#F7F5F1", elevated: "#FFFFFF", sunken: "#EFEBE3" },
        ink: { DEFAULT: "#211C17", soft: "#5C544A", faint: "#948C7E" },
        line: "#E4DED2",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      spacing: {
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '8.5': '2.125rem',
      },
      boxShadow: {
        card: "0 1px 2px rgba(33,28,23,0.04), 0 8px 24px -12px rgba(33,28,23,0.12)",
        cardHover: "0 4px 8px rgba(33,28,23,0.06), 0 16px 32px -12px rgba(33,28,23,0.18)",
      },
    },
  },
  plugins: [],
}