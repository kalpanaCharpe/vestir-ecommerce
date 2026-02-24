/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        obsidian: {
          50: '#f5f5f0',
          100: '#e8e8df',
          200: '#d0d0c0',
          300: '#a8a890',
          400: '#888870',
          500: '#686858',
          600: '#504840',
          700: '#383028',
          800: '#201a14',
          900: '#100e08',
          950: '#080604',
        },
        gold: {
          50: '#fdf9ef',
          100: '#f9f0d5',
          200: '#f2de9f',
          300: '#e9c460',
          400: '#e0ab35',
          500: '#d4921e',
          600: '#b87018',
          700: '#944f18',
          800: '#773e1a',
          900: '#623419',
          950: '#371809',
        },
        cream: '#faf8f4',
        charcoal: '#1a1814',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(30px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      },
    },
  },
  plugins: [],
}
