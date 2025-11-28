// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mich: ["var(--font-michroma)", "sans-serif"],
        bbh: ["var(--font-bbh)", "sans-serif"],
        smooch: ["var(--font-smooch)", "sans-serif"],
      },
    },
  },
  plugins: [],
};