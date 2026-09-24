/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        navy: "#0A2540",
        cobalt: { DEFAULT: "#0066F5", deep: "#004BBB", ink: "#003E99", tint: "#E6F0FF", wash: "#F0F6FF" },
        ink: { muted: "#3D4B5C" },
        danger: { DEFAULT: "#B91C1C", strong: "#991B1B", ink: "#7F1D1D", tint: "#FEF2F2" },
        safe: { DEFAULT: "#047857", strong: "#065F46", ink: "#064E3B", tint: "#ECFDF5", mint: "#A7F3D0" },
        warn: { ink: "#78350F", tint: "#FEF3C7" },
      },
    },
  },
  plugins: [],
};
