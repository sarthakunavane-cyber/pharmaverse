/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        medical: {
          dark: '#0a192f',
          blue: '#112240',
          cyan: '#00ffff',
          teal: '#00ffaa',
          violet: '#8a2be2',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.2)',
        'neon-teal': '0 0 15px rgba(0, 255, 170, 0.5), inset 0 0 10px rgba(0, 255, 170, 0.2)',
        'holographic': '0 4px 30px rgba(0, 255, 255, 0.1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'gradient-x': 'gradientShift 15s ease infinite',
      }
    },
  },
  plugins: [],
}
