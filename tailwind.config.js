/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EAFDF9',
          100: '#C8FAF0',
          200: '#8FF5E1',
          300: '#2DECCC',   // primary cyan (logo text)
          400: '#22C9AE',
          500: '#1AA890',
          600: '#148673',
          700: '#0F6557',
        },
        glow: {
          rose:   '#E84388',
          purple: '#A64AC9',
          blue:   '#5B6BBF',
        },
        accent: {
          300: '#FCD34D',
          400: '#FBBF24',   // CTA warm gold
          500: '#F59E0B',
        },
        surface: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(45, 236, 204, 0.15)',
        'glow-md': '0 0 25px -5px rgba(45, 236, 204, 0.2)',
        'glow-lg': '0 0 40px -5px rgba(45, 236, 204, 0.25)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #E84388, #A64AC9, #5B6BBF)',
        'brand-gradient-r': 'linear-gradient(to right, #E84388, #A64AC9, #5B6BBF)',
      },
      container: {
        center: true,
        padding: '1rem',
      },
      animation: {
        'scroll-down': 'scrollDown 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
