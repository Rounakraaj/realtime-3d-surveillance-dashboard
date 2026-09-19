module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cyber: '0 0 80px rgba(0, 255, 255, 0.08)',
      },
      colors: {
        cyber: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          green: '#00ff00',
        },
        magenta: {
          300: '#ff33ff',
          500: '#ff00ff',
          700: '#cc00cc',
        },
      },
    },
  },
  plugins: [],
}
