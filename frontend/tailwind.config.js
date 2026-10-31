export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          dark: '#1d1d1f',
          gray: '#86868b',
          lightgray: '#f5f5f7',
          card: '#ffffff',
          blue: '#0071e3',
          hoverblue: '#0077ed',
          border: 'rgba(0, 0, 0, 0.08)',
          subtle: '#6e6e73'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'apple-hover': '0 12px 32px rgba(0, 0, 0, 0.1)',
        'apple-modal': '0 24px 60px rgba(0, 0, 0, 0.18)'
      }
    },
  },
  plugins: [],
}
