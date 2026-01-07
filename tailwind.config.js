/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#000000',
        'bg-secondary': '#0a0a0a',
        'bg-tertiary': '#141414',
        'text-primary': '#FFFFFF',
        'text-secondary': '#a0a0a0',
        'text-tertiary': '#707070',
        'border-color': 'rgba(255, 255, 255, 0.1)',
        'card-bg': 'rgba(255, 255, 255, 0.03)',
      },
      fontFamily: {
        'ubuntu': ['Ubuntu', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
}
