/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          light: '#3B82F6',
          dark: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
          dark: '#0F766E',
        },
        accent: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
        },
        neutral: {
          DEFAULT: '#475569',
          light: '#64748B',
          dark: '#334155',
        },
        background: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        'content': '1280px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
} 