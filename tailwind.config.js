/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'brew-main': '#EBEBEB',
        'brew-alt': '#DFDFDF',
        'brew-accent': '#FD4040',
        'brew-text': '#141414',
        'brew-muted': '#7A7A7A',
        'brew-border': '#CDCDCD',
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        interMedium: ['Inter_500Medium'],
        interSemi: ['Inter_600SemiBold'],
      },
    },
  },
  plugins: [],
};
