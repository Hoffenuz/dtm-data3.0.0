/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#28CB8B',
        'primary-dark': '#43A046',
        secondary: '#263238',
        info: '#2194f3',
        grey: {
          DEFAULT: '#717171',
          dark: '#4D4D4D',
          light: '#89939E',
          blue: '#ABBED1',
        },
        silver: '#F5F7FA',
        success: '#2E7D31',
        warning: '#FBC02D',
        error: '#E53835',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
