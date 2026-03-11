'use strict';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        'kayzen-green': {
          DEFAULT: '#4CAF50', // Main Kayzen green
          50: '#A5D6A7',
          100: '#81C784',
          200: '#66BB6A',
          300: '#4CAF50',
          400: '#43A047',
          500: '#388E3C',
          600: '#2E7D32',
          700: '#1B5E20',
          800: '#1B5E20',
          900: '#004D40',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};