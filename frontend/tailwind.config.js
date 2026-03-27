/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spring: {
          green: '#4ade80',
          lightgreen: '#86efac',
          blue: '#60a5fa',
          pink: '#f9a8d4',
          yellow: '#fde047',
        },
      },
      animation: {
        'spin-wheel': 'spin 4s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards',
      },
    },
  },
  plugins: [],
}
