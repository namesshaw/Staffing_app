module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#F5F7FF',
          100: '#EBEEFF',
          200: '#D6DFFF',
          300: '#B4C2FF',
          400: '#8494FF',
          500: '#4C6FFF',
          600: '#1D3FFF',
          700: '#0026FF',
          800: '#001ECC',
          900: '#001899',
        },
        starlight: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B8DFFF',
          300: '#8CCFFF',
          400: '#47B9FF',
          500: '#1A9FFF',
          600: '#0077E6',
          700: '#005CB3',
          800: '#004080',
          900: '#002B66',
        },
        night: {
          50: '#E6E8ED',
          100: '#BEC3CC',
          200: '#929BAA',
          300: '#677388',
          400: '#4B566F',
          500: '#2F3957',
          600: '#252D47',
          700: '#1B2137',
          800: '#111627',
          900: '#0B0F1A',
        },
      },
      backgroundImage: {
        'gradient-cosmic': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        float: 'float 6s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}