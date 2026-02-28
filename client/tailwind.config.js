/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        "primary-hover": "#4338CA",
        "background-light": "#F3F4F6",
        "background-dark": "#111827",
        "card-light": "#FFFFFF",
        "card-dark": "#1F2937",
      },
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};