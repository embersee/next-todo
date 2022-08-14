/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        200: '200px',
      },
      minHeight: {
        400: '400px',
      },
    },
  },
  plugins: [],
}
