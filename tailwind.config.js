/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lime:     '#BFFF00',
        'lime-dim': '#8FBF00',
        'axiom-black': '#080808',
        'axiom-dark': '#0F0F0F',
        'axiom-card': '#141414',
        'axiom-card2': '#1A1A1A',
        'axiom-white': '#F5F5F0',
        'axiom-muted': '#666666',
        'axiom-border': '#222222',
      },
      fontFamily: {
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        body:      ['Barlow', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease both',
        'pulse-lime': 'pulseLime 2s ease-in-out infinite',
        ticker:       'ticker 20s linear infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLime: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(191,255,0,0.15)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(191,255,0,0)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
