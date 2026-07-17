import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'dark' 
  }),
  
  actions: {
    initTheme() {
      this.applyTheme(this.theme)
    },
    
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      this.applyTheme(this.theme)
    },
    
    applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
        document.body.classList.add('dark-theme') 
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
        document.body.classList.remove('dark-theme')
      }
    }
  }
})