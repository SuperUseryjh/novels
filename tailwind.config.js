/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'serif-sc': ['Noto Serif SC', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'paper': {
          'bg': '#fdfaf5',
          'text': '#2c2c2c',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-in': 'toastIn 0.3s ease-out forwards',
        'slide-in-up': 'slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(15px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          'from': { opacity: '0', transform: 'translate(-50%, 20px)' },
          'to': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        slideInUp: {
          'from': { transform: 'translateY(100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
