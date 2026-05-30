import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isSuperuser: (state) => state.user?.is_superuser || false,
    userName: (state) => state.user?.first_name || state.user?.email || ''
  },
  actions: {
    initAuth() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.fetchUser()
      }
    },
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/token/', { username: email, password })
        this.token = response.data.access
        localStorage.setItem('token', this.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        await this.fetchUser()
        return true
      } catch (err) {
        this.error = 'E-mail ou senha inválidos.'
        return false
      } finally {
        this.loading = false
      }
    },
    async register(name, email, password) {
      this.loading = true
      this.error = null
      try {
        await api.post('/catalog/auth/register/', { first_name: name, email, password })
        return await this.login(email, password)
      } catch (err) {
        this.error = 'Erro ao criar conta. O e-mail pode já estar em uso.'
        return false
      } finally {
        this.loading = false
      }
    },
    async fetchUser() {
      try {
        const response = await api.get('/catalog/auth/me/')
        this.user = response.data
      } catch (err) {
        this.logout()
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }
})