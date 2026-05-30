import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
    isOpen: false
  }),
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    cartTotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },
  actions: {
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += product.quantity
      } else {
        this.items.push(product)
      }
      this.saveCart()
      this.openCart()
    },
    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveCart()
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item && quantity >= 1) {
        item.quantity = quantity
      }
      this.saveCart()
    },
    clearCart() {
      this.items = []
      this.saveCart()
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    openCart() {
      this.isOpen = true
    },
    closeCart() {
      this.isOpen = false
    },
    toggleCart() {
      this.isOpen = !this.isOpen
    }
  }
})