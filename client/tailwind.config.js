/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#004e9f',
          primaryHover: '#003d7c',
          success: '#34A853',
          canvas: '#f9f9ff',
        },
        primary: {
          DEFAULT: '#004e9f',
          hover: '#003d7c',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#004e9f',
          600: '#003d7c',
          700: '#002c59',
        },
        success: {
          DEFAULT: '#34A853',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#34A853',
          600: '#2e9549',
        },
        canvas: '#f9f9ff',
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
}
