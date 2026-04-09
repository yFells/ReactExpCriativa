/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"Barlow"', 'sans-serif'],
      },
      colors: {
        pitch: { 50: '#f0fdf4', 500: '#22c55e', 900: '#052e16' },
        jersey: { 500: '#16a34a', 700: '#15803d', 900: '#14532d' },
        gold: { 400: '#facc15', 500: '#eab308' },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
