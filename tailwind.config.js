/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          dark: '#115E59',
          light: '#CCFBF1',
          muted: '#F0FDFA',
        },
        // Semantic
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
        // Surface
        surface: '#FFFFFF',
        border: '#E2E8F0',
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'DEFAULT': '0 2px 6px rgba(0, 0, 0, 0.07)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      fontSize: {
        'xs': ['12px', '1.4'],
        'sm': ['13px', '1.5'],
        'base': ['14px', '1.5'],
        'md': ['15px', '1.6'],
        'lg': ['16px', '1.5'],
        'xl': ['18px', '1.4'],
        '2xl': ['22px', '1.3'],
        '3xl': ['28px', '1.2'],
        '4xl': ['32px', '1.2'],
      },
    },
  },
  plugins: [],
}
