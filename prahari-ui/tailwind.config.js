/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa',
        surface: '#ffffff',
        primary: '#1e3a5f', // deep navy
        secondary: '#4b5320', // olive/army green
        accent: '#c3b091', // khaki
        muted: '#36454f', // charcoal
        'band-stable': '#e2e8f0', // neutral
        'band-monitor': '#fef08a', // pale yellow
        'band-checkin': '#fdba74', // soft orange
        'band-priority': '#d97706', // dark amber/rust instead of bright red
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
