<template>
  <div class="minicart-overlay" :class="{ 'is-open': cartStore.isOpen }" @click.self="cartStore.closeCart">
    <div class="minicart-drawer" :class="{ 'is-open': cartStore.isOpen }">
      <div class="minicart-header">
        <h2>Meu Carrinho</h2>
        <button class="close-btn" @click="cartStore.closeCart">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="minicart-body">
        <div v-if="cartStore.items.length === 0" class="empty-cart">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p>Sua cesta está vazia.</p>
        </div>

        <div v-else class="cart-items">
          <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
            <div class="item-image">
              <img v-if="item.image" :src="item.image" :alt="item.name">
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="fallback-img">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div class="item-details">
              <div class="item-header">
                <h3>{{ item.name }}</h3>
                <button class="remove-icon" @click="cartStore.removeItem(item.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="item-pricing">
                <span class="price-current">{{ formatPrice(item.price) }}</span>
              </div>

              <div class="item-footer">
                <span class="seller-info">Vendido e Entregue por: <strong>DLS Auto Peças</strong></span>
                
                <div class="qty-control-green">
                  <button class="qty-btn" @click="cartStore.updateQuantity(item.id, item.quantity - 1)" v-if="item.quantity > 1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>
                  </button>
                  <button class="qty-btn" @click="cartStore.removeItem(item.id)" v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  
                  <span class="qty-display">{{ item.quantity }}</span>
                  
                  <button class="qty-btn" @click="cartStore.updateQuantity(item.id, item.quantity + 1)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="minicart-footer" v-if="cartStore.items.length > 0">
        <div class="shipping-calc">
          <input type="text" placeholder="Digite seu CEP" v-model="cep" maxlength="9">
          <p class="shipping-hint">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            Informe seu CEP para consultar condições de <strong>Frete Grátis.</strong>
          </p>
          <span class="shipping-promo">Frete Grátis acima de R$ 500,00. Consulte condições.</span>
        </div>

        <div class="summary-lines">
          <div class="line">
            <span>Subtotal:</span>
            <span>{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
          <div class="line">
            <span>Entrega:</span>
            <span>A calcular</span>
          </div>
          <div class="line total">
            <span>Total:</span>
            <span>{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-checkout" @click="goToCheckout">
            Finalizar
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          <button class="btn-continue" @click="cartStore.closeCart">
            Continuar comprando
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'

const cartStore = useCartStore()
const router = useRouter()
const cep = ref('')

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const goToCheckout = () => {
  cartStore.closeCart()
  router.push('/checkout')
}
</script>

<style scoped>
.minicart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.minicart-overlay.is-open {
  opacity: 1;
  visibility: visible;
}

.minicart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 420px;
  height: 100vh;
  background-color: #ffffff;
  z-index: 9999;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
}

.minicart-drawer.is-open {
  transform: translateX(0);
}

.minicart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.minicart-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #008f4c;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: #008f4c;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.minicart-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #f9fafb;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
}

.empty-cart svg {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  gap: 1rem;
}

.item-image {
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.fallback-img {
  width: 2rem;
  height: 2rem;
  color: #d1d5db;
}

.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.item-header h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
  line-height: 1.3;
}

.remove-icon {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  color: #4b5563;
  cursor: pointer;
  padding: 0.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-icon svg {
  width: 1rem;
  height: 1rem;
}

.item-pricing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.price-current {
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
}

.item-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
}

.seller-info {
  font-size: 0.7rem;
  color: #6b7280;
}

.seller-info strong {
  color: #374151;
}

.qty-control-green {
  display: flex;
  align-items: center;
  background-color: #008f4c;
  border-radius: 0.25rem;
  width: fit-content;
  overflow: hidden;
}

.qty-btn {
  background: none;
  border: none;
  color: #ffffff;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.qty-btn svg {
  width: 1.1rem;
  height: 1.1rem;
}

.qty-btn:hover {
  background-color: #00733c;
}

.qty-display {
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  width: 30px;
  text-align: center;
}

.minicart-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem;
  background-color: #ffffff;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.02);
}

.shipping-calc {
  margin-bottom: 1.5rem;
}

.shipping-calc input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 1.5rem;
  font-size: 0.9rem;
  outline: none;
  margin-bottom: 0.75rem;
  color: #374151;
}

.shipping-calc input:focus {
  border-color: #008f4c;
}

.shipping-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #008f4c;
  margin: 0 0 0.25rem 0;
}

.shipping-hint svg {
  width: 1rem;
  height: 1rem;
}

.shipping-promo {
  font-size: 0.75rem;
  color: #4b5563;
  display: block;
}

.summary-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.line {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #374151;
}

.line.total {
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #e5e7eb;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-checkout {
  background-color: #008f4c;
  color: #ffffff;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-checkout:hover {
  background-color: #00733c;
}

.btn-checkout svg {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-continue {
  background-color: #ffffff;
  color: #008f4c;
  border: 1px solid #008f4c;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-continue:hover {
  background-color: #f0fdf4;
}
</style>