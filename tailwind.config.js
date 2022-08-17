/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      willChange: {
        'transform-opacity-height': 'transform, opacity, height',
      },
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
