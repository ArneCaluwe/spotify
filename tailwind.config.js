/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-ternary': 'var(--bg-ternary)',
        'inverse-primary': 'var(--inverse-primary)',
        'inverse-secondary': 'var(--inverse-secondary)',
        'inverse-ternary': 'var(--inverse-ternary)',
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
