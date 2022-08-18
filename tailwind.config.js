/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      borderColor: {
        'night-sky': '#262635',
        'super-silver': '#efefef',
      },
      colors: {
        'night-sky': '#262635',
        'super-silver': '#efefef',
        'black-velvet': '#1E1E2A',
      },
      backgroundColor: {
        'night-sky': '#262635',
        'super-silver': '#efefef',
        'black-velvet': '#1E1E2A',
      },
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
