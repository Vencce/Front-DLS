import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('access_token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isSuperuser: (state) => state.user?.is_superuser || false,
    userName: (state) => state.user?.first_name || state.user?.username || ''
  },
  actions: {
    initAuth() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.fetchUser()
      }
    },
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/token/', { username, password })
        this.token = response.data.access
        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        await this.fetchUser()
        return true
      } catch (err) {
        this.error = 'Credenciais inválidas. Verifique seu usuário e senha.'
        return false
      } finally {
        this.loading = false
      }
    },
    async register(name, username, email, password) {
      this.loading = true
      this.error = null
      try {
        await api.post('/auth/register/', { first_name: name, username, email, password })
        return await this.login(username, password)
      } catch (err) {
        this.error = 'Erro ao criar conta. O usuário ou e-mail já estão em uso.'
        return false
      } finally {
        this.loading = false
      }
    },
    async fetchUser() {
      try {
        const response = await api.get('/auth/me/')
        this.user = response.data
      } catch (err) {
        this.logout()
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete api.defaults.headers.common['Authorization']
    }
  }
})