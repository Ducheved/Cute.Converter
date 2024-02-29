import { defineStore } from 'pinia'

export const useDarkModeStore = defineStore({
  id: 'darkMode',
  state: () => ({
    isDarkMode: localStorage.getItem('darkMode') === 'true'
  }),
  actions: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('darkMode', this.isDarkMode)
      document.documentElement.classList.toggle('dark', this.isDarkMode)
    }
  }
})
