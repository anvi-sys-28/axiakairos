/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        axia: {
          navy: '#0b192c',
          navyDark: '#071325',
          navyText: '#0a1626',
          slate: '#6784a3',
          slateMuted: '#5a6e85',
          gold: '#c2a675',
          goldAccent: '#d4b785',
          offwhite: '#f8f9fb',
          offwhiteBar: '#f5f6f9',
          bodyGrey: '#556579',
          cardBg: 'rgba(12, 23, 38, 0.65)',
          cardBgHover: 'rgba(18, 33, 54, 0.75)',
          cardBorder: 'rgba(255, 255, 255, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        widestLg: '0.25em',
        tightHeadline: '-0.035em',
      },
      boxShadow: {
        search: '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        card: '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
