import { defineStore } from 'pinia'
import api from '../services/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    brands: [],
    totalItems: 0,
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
        this.totalItems = response.data.count !== undefined ? response.data.count : this.products.length
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
    },
    async createCategory(name) {
      try {
        const response = await api.post('/categories/', { name })
        const newCategory = response.data
        this.categories.push(newCategory)
        return newCategory
      } catch (err) {
        this.error = 'Erro ao criar categoria.'
        console.error('Falha no createCategory:', err.response?.data || err)
        throw err
      }
    },
    async createBrand(name) {
      try {
        const response = await api.post('/brands/', { name })
        const newBrand = response.data
        this.brands.push(newBrand)
        return newBrand
      } catch (err) {
        this.error = 'Erro ao criar marca.'
        console.error('Falha no createBrand:', err.response?.data || err)
        throw err
      }
    },
    // Novas Ações de Exclusão Inline
    async deleteCategory(id) {
      try {
        await api.delete(`/categories/${id}/`)
        this.categories = this.categories.filter(c => c.id !== id)
      } catch (err) {
        this.error = 'Erro ao excluir categoria.'
        console.error('Falha no deleteCategory:', err.response?.data || err)
        throw err
      }
    },
    async deleteBrand(id) {
      try {
        await api.delete(`/brands/${id}/`)
        this.brands = this.brands.filter(b => b.id !== id)
      } catch (err) {
        this.error = 'Erro ao excluir marca.'
        console.error('Falha no deleteBrand:', err.response?.data || err)
        throw err
      }
    }
  }
})