/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dsat: {
          orange: '#f97316',
          orangeDark: '#ea580c',
          amber: '#f59e0b',
          amberLight: '#fef3c7',
          yellow: '#eab308',
          dark: '#18181b',
          darker: '#09090b',
          surface: '#fafaf9',
          border: '#e4e4e7',
        },
        sat: {
          blue: '#18181b', // modernized dark for exam header
          blueLight: '#f97316',
          blueDark: '#09090b',
          accent: '#f97316',
          gold: '#f59e0b',
          surface: '#fafaf9',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}

