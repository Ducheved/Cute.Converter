import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import aspectRatio from '@tailwindcss/aspect-ratio'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Balsamiq Sans', 'Victor Mono', 'sans-serif'],
      }
    }, 
  },
  plugins: [
    forms,
    typography,
    aspectRatio
  ],
}