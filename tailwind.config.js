/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'rgb(0,0,0)',
        'bg-secondary': 'rgb(18, 18, 18)',
        'bg-ternary': 'rgb(67, 67, 67)',
      },
      gap: {
        theme: '8px',
      },
      gridTemplateColumns: {
        theme: '72px 1fr',
      },
      gridTemplateRows: {
        theme: '1fr 79px',
      },
    },
  },
  plugins: [],
};
