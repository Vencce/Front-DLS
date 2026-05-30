import { defineStore } from 'pinia'
import api from '../services/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalItems: 0
  }),
  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/catalog/products/', { params })
        this.products = response.data.results
        this.totalItems = response.data.count
        this.totalPages = Math.ceil(response.data.count / 12)
      } catch (err) {
        this.error = 'Erro ao carregar os produtos do catálogo.'
      } finally {
        this.loading = false
      }
    },
    async fetchProductById(id) {
      this.loading = true
      this.error = null
      this.currentProduct = null
      try {
        const response = await api.get(`/catalog/products/${id}/`)
        this.currentProduct = response.data
      } catch (err) {
        this.error = 'Erro ao carregar os detalhes do produto.'
      } finally {
        this.loading = false
      }
    }
  }
})