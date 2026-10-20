/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0a84ff',
          blueHover: '#0071e3',
          darkBg: '#090a0f',
          surface: '#12141a',
          surfaceMuted: '#181b24',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Plus Jakarta Sans"',
          '"Inter"',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
