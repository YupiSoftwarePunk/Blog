/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,js}",
  ],
  theme: {
    extend: {
      colors: {
        'win-gray': '#c0c0c0',
        'win-blue': '#000080',
        'win-blue-light': '#1084d0',
        'win-border-light': '#ffffff',
        'win-border-dark': '#808080',
      },
      boxShadow: {
        'win-outset': 'inset 1px 1px #fff, inset -1px -1px #808080, 1px 1px #000',
        'win-inset': 'inset 1px 1px #808080, inset -1px -1px #fff, 1px 1px #dfdfdf',
      }
    },
  },
  plugins: [],
}