/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primaryBlack: '#000000',
        primaryWhite: '#FFFFFF',
        dark70: '#666666',
        dark50: '#969696',
        grey30: '#CCCCCC',
        grey20: '#E3E3E3',
        grey05: '#F0F0F0',
        customLight: 'rgba(241, 241, 241, 0.9)',
        modeDark: '#31363F',
      },
      fontSize: {
        display: ['64px', '1.2'],
        h1: ['40px', '1.4'],
        h2: ['32px', '1.4'],
        h3: ['24px', '1.4'],
        h4: ['18px', '1.4'],
        bodyDefault: ['16px', '1.4'],
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
