import { defineStore } from 'pinia'
import api from '../services/api'
import { useCartStore } from './cartStore'

export const useOrderStore = defineStore('order', {
  state: () => ({
    loading: false,
    error: null,
    lastOrder: null
  }),
  actions: {
    async createOrder(orderData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/orders/checkout/', orderData)
        this.lastOrder = response.data
        const cartStore = useCartStore()
        cartStore.clearCart()
        return true
      } catch (err) {
        this.error = 'Erro ao processar o pedido. Verifique os dados e tente novamente.'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})