// src/stores/authStore.js
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
  }),

  getters: {
    isSuperuser: (state) => state.user?.is_superuser ?? false,
    userName: (state) => {
      if (!state.user) return ''
      const fullName = `${state.user.first_name || ''} ${state.user.last_name || ''}`.trim()
      return fullName || state.user.username || state.user.email || ''
    },
  },

  actions: {
    async initAuth() {
      if (this.user || !this.accessToken) return

      api.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

      try {
        const response = await api.get('/auth/me/')
        this.user = response.data
        this.isAuthenticated = true
      } catch (err) {
        this.logout()
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/token/', credentials)
        const { access, refresh, user } = response.data

        this.accessToken = access
        this.refreshToken = refresh
        this.user = user
        this.isAuthenticated = true

        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', refresh)
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`

        const me = await api.get('/auth/me/')
        this.user = me.data
        this.isAuthenticated = true

        return me.data
      } catch (err) {
        this.error = err.response?.data?.detail || 'Erro ao fazer login'
        throw err
      } finally {
        this.loading = false
      }
    },
    // ACTION NOVA: Login com Google totalmente integrada
    async loginWithGoogle(googleToken) {
      this.loading = true
      this.error = null
      try {
        // Envia o ID Token que o Google gerou no front para a nossa rota do Django.
        // Importante: a chave precisa ser "id_token" — é o nome do campo que o
        // GoogleAuthSerializer do backend valida (antes estava como "token").
        const response = await api.post('/auth/google/', { id_token: googleToken })

        // O Django valida e responde com o NOSSO par de tokens JWT e os dados do usuário
        const { access, refresh, user } = response.data

        this.accessToken = access
        this.refreshToken = refresh
        this.user = user
        this.isAuthenticated = true

        // Salva as sessões no navegador do cliente para ele não precisar relogar ao atualizar a página
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', refresh)

        // Injeta automaticamente o token nas próximas requisições da API de Autopeças
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`

        const me = await api.get('/auth/me/')
        this.user = me.data
        this.isAuthenticated = true

        return me.data
      } catch (err) {
        this.error = err.response?.data?.erro || 'Erro ao autenticar com o Google'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Remove as credenciais ao sair do sistema
    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      delete api.defaults.headers.common['Authorization']
    },

    async register({ name, email, password }) {
      this.loading = true
      this.error = null
      try {
        await api.post('/auth/register/', {
          username: email, // mesma convenção usada no Google login e no cadastro pelo admin: username = email
          email,
          password,
          first_name: name,
        })
        // Login automático logo após criar a conta
        return await this.login({ username: email, password })
      } catch (err) {
        this.error =
          err.response?.data?.email?.[0] ||
          err.response?.data?.username?.[0] ||
          err.response?.data?.password?.[0] ||
          'Erro ao criar conta'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
