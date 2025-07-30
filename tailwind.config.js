/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Share Tech Mono', 'monospace'],
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-move': 'grid-move 20s linear infinite',
        'scanlines': 'scanlines 0.1s linear infinite',
      },
      keyframes: {
        'grid-move': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' }
        },
        'scanlines': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(4px)' }
        }
      },
      colors: {
        'neon-pink': '#ff1493',
        'neon-cyan': '#00ffff',
        'neon-purple': '#9d00ff',
        'neon-green': '#39ff14',
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(255, 20, 147, 0.5)',
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(157, 0, 255, 0.5)',
      }
    },
  },
  plugins: [],
};
