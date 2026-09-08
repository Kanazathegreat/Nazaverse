import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F7',
        surface: '#FFFFFF',
        primary: '#1D1D1F',
        secondary: '#6E6E73',
        accent: '#0A84FF',
        traffic: {
          red: '#FF5F57',
          yellow: '#FEBC2E',
          green: '#28C840',
        },
      },
      borderRadius: {
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0, 0, 0, 0.08)',
        macos: '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
};

export default config;
