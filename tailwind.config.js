/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}',
    './node_modules/daisyui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        error: 'hsl(var(--error))',
      },
      keyframes: {
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        particleMove: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100vh)' },
        },
        toastProgress: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
        slideDown: {
          '0%': { opacity: 0, transform: 'translateY(-1rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'gradient-x': 'gradientX 15s ease infinite',
        'particle-move': 'particleMove 30s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'toast-progress': 'toastProgress var(--toast-duration, 4000ms) linear forwards',
        'slide-down': 'slideDown 300ms ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'light',
    base: true,
    styled: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
