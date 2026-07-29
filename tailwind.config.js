/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#070709',
          card: '#0F0F16',
          elevated: '#171722',
          border: '#242436',
        },
        gold: {
          50: '#FFFDF0',
          100: '#FFF9C2',
          200: '#FFF185',
          300: '#FFE247',
          400: '#F0C71D',
          500: '#D4AF37', // Primary Luxury Gold
          600: '#AA8522',
          700: '#805F16',
          800: '#5A4110',
          900: '#3D2A09',
        },
        bronze: {
          400: '#E2B857',
          500: '#C4942A',
          600: '#997116',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        cinematic: ['Cinzel', 'serif']
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5D77F 0%, #D4AF37 50%, #997520 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgba(15,15,22,0.8) 0%, rgba(7,7,9,0.95) 100%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.3))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.7))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
