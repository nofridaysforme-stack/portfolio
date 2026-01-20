import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D97E3C',
          50: '#FDF5EF',
          100: '#FAE9DC',
          200: '#F5D4B9',
          300: '#F0BE95',
          400: '#EBA972',
          500: '#D97E3C',
          600: '#C66A28',
          700: '#9C5420',
          800: '#723E18',
          900: '#482810',
        },
        secondary: {
          DEFAULT: '#D4AF6A',
          50: '#FBF7ED',
          100: '#F7EEDB',
          200: '#EFDDB7',
          300: '#E7CC93',
          400: '#DFBB6F',
          500: '#D4AF6A',
          600: '#C19A4F',
          700: '#9A7B3F',
          800: '#735C2F',
          900: '#4C3D1F',
        },
        dark: {
          DEFAULT: '#2D2D2D',
          50: '#E8E8E8',
          100: '#D1D1D1',
          200: '#A3A3A3',
          300: '#757575',
          400: '#474747',
          500: '#2D2D2D',
          600: '#242424',
          700: '#1B1B1B',
          800: '#121212',
          900: '#090909',
        },
        light: {
          DEFAULT: '#F5F5F0',
          50: '#FFFFFF',
          100: '#FEFEFE',
          200: '#FCFCFB',
          300: '#F9F9F6',
          400: '#F7F7F3',
          500: '#F5F5F0',
          600: '#E8E8DD',
          700: '#DBDBCA',
          800: '#CECEB7',
          900: '#C1C1A4',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
