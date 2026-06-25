import { defineStore } from 'pinia'
import api from '../services/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    brands: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/products/', { params })
        this.products = response.data.results || response.data
      } catch (err) {
        this.error = 'Erro ao carregar os produtos do catálogo.'
      } finally {
        this.loading = false
      }
    },
    async fetchCategories() {
      try {
        const response = await api.get('/categories/')
        this.categories = response.data.results || response.data
      } catch (err) {
        this.error = 'Erro ao carregar categorias.'
      }
    },
    async fetchBrands() {
      try {
        const response = await api.get('/brands/')
        this.brands = response.data.results || response.data
      } catch (err) {
        this.error = 'Erro ao carregar marcas.'
      }
    }
  }
})