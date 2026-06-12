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

const goToCatalog = () => {
  cartStore.closeCart()
  router.push('/catalogo')
}
</script>

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
          <button class="btn-start-shopping" @click="goToCatalog">Começar a comprar</button>
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
                <div class="title-wrap">
                  <h3>{{ item.name }}</h3>
                  <span class="item-brand">{{ item.brand || 'DLS Auto Peças' }}</span>
                </div>
                <button class="remove-icon" @click="cartStore.removeItem(item.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div class="item-footer">
                <div class="item-pricing">
                  <span class="price-current">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>

                <div class="qty-control-green">
                  <button class="qty-btn" @click="cartStore.updateQuantity(item.id, item.quantity - 1)" v-if="item.quantity > 1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>
                  </button>
                  <button class="qty-btn remove-state" @click="cartStore.removeItem(item.id)" v-else>
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
          <label>Calcular Frete</label>
          <div class="cep-input-row">
            <input type="text" placeholder="00000-000" v-model="cep" maxlength="9">
            <button class="btn-calc-cep">OK</button>
          </div>
          <span class="shipping-promo">Frete Grátis acima de R$ 500,00</span>
        </div>

        <div class="summary-lines">
          <div class="line">
            <span>Subtotal:</span>
            <span>{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
          <div class="line total">
            <span>Total:</span>
            <span>{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-checkout" @click="goToCheckout">
            Ir para o Pagamento
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          <button class="btn-continue" @click="goToCatalog">
            Adicionar mais peças
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.minicart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
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
  background-color: var(--surface-color, #ffffff);
  z-index: 9999;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 25px rgba(0, 0, 0, 0.15);
}

.minicart-drawer.is-open {
  transform: translateX(0);
}

.minicart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--surface-color, #ffffff);
}

.minicart-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--primary-dark, #004d28);
  font-weight: 800;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted, #6b7280);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--primary-light, #008f4c);
}

.close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.minicart-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: var(--bg-color, #f9fafb);
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted, #9ca3af);
  text-align: center;
}

.empty-cart svg {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  color: var(--border-color, #e5e7eb);
}

.empty-cart p {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main, #374151);
  margin-bottom: 1.5rem;
}

.btn-start-shopping {
  background-color: var(--primary-light, #008f4c);
  color: #ffffff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-start-shopping:hover {
  background-color: var(--primary-hover, #00733c);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-item {
  display: flex;
  flex-direction: row;
  background-color: var(--surface-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.75rem;
  padding: 0.75rem;
  gap: 0.75rem;
  align-items: stretch;
}

.item-image {
  width: 75px;
  height: 75px;
  min-width: 75px;
  min-height: 75px;
  background-color: var(--surface-hover, #f3f4f6);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.25rem;
}

.item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.fallback-img {
  width: 2rem;
  height: 2rem;
  color: var(--text-muted, #d1d5db);
}

.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 87px);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.title-wrap {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
}

.item-header h3 {
  margin: 0 0 0.15rem 0;
  font-size: 0.9rem;
  color: var(--text-main, #374151);
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.item-brand {
  font-size: 0.7rem;
  color: var(--text-muted, #6b7280);
  text-transform: capitalize;
  font-weight: 600;
}

.remove-icon {
  background: none;
  border: none;
  color: var(--text-muted, #9ca3af);
  cursor: pointer;
  padding: 0.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  flex-shrink: 0;
}

.remove-icon:hover {
  color: #ef4444;
}

.remove-icon svg {
  width: 1.1rem;
  height: 1.1rem;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.price-current {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary-dark, #004d28);
  line-height: 1;
}

.qty-control-green {
  display: flex;
  align-items: center;
  background-color: var(--primary-light, #008f4c);
  border-radius: 0.4rem;
  height: 28px;
  overflow: hidden;
}

.qty-btn {
  background: none;
  border: none;
  color: #ffffff;
  width: 28px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.qty-btn:hover {
  background-color: var(--primary-hover, #00733c);
}

.qty-btn.remove-state:hover {
  background-color: #ef4444;
}

.qty-btn svg {
  width: 0.9rem;
  height: 0.9rem;
}

.qty-display {
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 24px;
  text-align: center;
}

.minicart-footer {
  background-color: var(--surface-color, #ffffff);
  border-top: 1px solid var(--border-color, #e5e7eb);
  padding: 1.25rem 1.5rem;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.03);
}

.shipping-calc {
  margin-bottom: 1.25rem;
}

.shipping-calc label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main, #374151);
  margin-bottom: 0.4rem;
}

.cep-input-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.cep-input-row input {
  flex-grow: 1;
  padding: 0.6rem 0.75rem;
  background-color: var(--bg-color, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  font-size: 0.85rem;
  outline: none;
  color: var(--text-main, #374151);
  transition: border-color 0.2s;
}

.cep-input-row input:focus {
  border-color: var(--primary-light, #008f4c);
}

.btn-calc-cep {
  background-color: var(--surface-hover, #f3f4f6);
  color: var(--text-main, #374151);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  padding: 0 1rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.shipping-promo {
  font-size: 0.75rem;
  color: var(--primary-light, #008f4c);
  font-weight: 600;
}

.summary-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.line {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-main, #374151);
}

.line.total {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main, #111827);
  margin-top: 0.25rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border-color, #e5e7eb);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-checkout {
  background-color: var(--primary-light, #008f4c);
  color: #ffffff;
  border: none;
  padding: 0.85rem;
  border-radius: 0.5rem;
  font-weight: 800;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-checkout:hover {
  background-color: var(--primary-hover, #00733c);
}

.btn-checkout svg {
  width: 1.2rem;
  height: 1.2rem;
}

.btn-continue {
  background-color: transparent;
  color: var(--text-muted, #6b7280);
  border: none;
  padding: 0.75rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-continue:hover {
  color: var(--primary-light, #008f4c);
  text-decoration: underline;
}
</style>