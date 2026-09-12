/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campfire: {
          darkest: '#09080D',
          dark: '#110F17',
          surface: '#181522',
          card: '#221C2F',
          border: '#352C47',
          muted: '#8A7F9D',
          ember: '#FF5722',
          flame: '#FF7A00',
          gold: '#FFB703',
          ash: '#453E54',
          blood: '#E63946'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Outfit', 'serif']
      },
      boxShadow: {
        'flame': '0 0 25px -5px rgba(255, 87, 34, 0.4), 0 0 10px -2px rgba(255, 122, 0, 0.3)',
        'flame-lg': '0 0 40px -5px rgba(255, 87, 34, 0.6), 0 0 20px -2px rgba(255, 183, 3, 0.4)',
        'ember-inner': 'inset 0 0 15px rgba(255, 122, 0, 0.25)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'flicker': 'flicker 1.8s infinite alternate ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        flicker: {
          '0%': { opacity: '0.9', transform: 'scale(1) skewX(0deg)' },
          '33%': { opacity: '0.95', transform: 'scale(1.02) skewX(-1deg)' },
          '66%': { opacity: '0.85', transform: 'scale(0.98) skewX(1deg)' },
          '100%': { opacity: '1', transform: 'scale(1.04) skewX(-0.5deg)' },
        }
      }
    },
  },
  plugins: [],
}
