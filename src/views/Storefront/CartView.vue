<template>
  <div class="cart-page">
    <div class="container">
      <div class="progress-bar-container" v-animate>
        <div class="progress-step active">
          <div class="step-circle">1</div>
          <span class="step-label">Carrinho</span>
        </div>
        <div class="step-line"></div>
        <div class="progress-step">
          <div class="step-circle">2</div>
          <span class="step-label">Entrega</span>
        </div>
        <div class="step-line"></div>
        <div class="progress-step">
          <div class="step-circle">3</div>
          <span class="step-label">Pagamento</span>
        </div>
      </div>

      <div class="cart-header" v-animate>
        <h1 class="page-title">Meu Carrinho</h1>
        <span class="item-count">Você tem {{ cartStore.totalItems }} iten(s) no carrinho</span>
      </div>

      <div v-if="cartStore.items.length === 0" class="empty-state" v-animate>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2>Seu carrinho está vazio</h2>
        <p>Navegue pelo nosso catálogo e encontre as peças que você precisa.</p>
        <router-link to="/catalogo" class="btn-primary">Ver Catálogo</router-link>
      </div>

      <div v-else class="cart-layout" v-animate>
        <div class="cart-items-list">
          <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
            <button class="remove-btn" @click="cartStore.removeItem(item.id)" title="Remover item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <div class="item-image">
              <img v-if="item.image" :src="item.image" :alt="item.name">
              <div v-else class="image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div class="item-details">
              <span class="item-brand">{{ item.brand || 'Sem marca' }}</span>
              <h3 class="item-name">{{ item.name }}</h3>
              <span class="item-unit-price">{{ formatPrice(item.price) }} / un.</span>
            </div>

            <div class="item-actions">
              <div class="qty-controls">
                <button @click="updateQuantity(item.id, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
                <input type="number" :value="item.quantity" readonly>
                <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
              </div>
              <div class="item-subtotal">
                <span class="subtotal-label">Subtotal</span>
                <span class="subtotal-value">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>
        </div>

        <aside class="cart-summary">
          <h2>Resumo da Compra</h2>
          <div class="summary-row">
            <span>Produtos ({{ cartStore.totalItems }})</span>
            <span>{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
          <div class="summary-row">
            <span>Frete Estimado</span>
            <span class="text-green">A calcular no checkout</span>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
          <router-link to="/checkout" class="btn-primary full-width">Prosseguir para Checkout</router-link>
          <router-link to="/catalogo" class="continue-shopping">Continuar Comprando</router-link>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/cartStore'
import { RouterLink } from 'vue-router'

const cartStore = useCartStore()

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const updateQuantity = (id, newQuantity) => {
  if (newQuantity >= 1) {
    cartStore.updateQuantity(id, newQuantity)
  }
}
</script>

<style scoped>
.cart-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding: 3rem 0;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  position: relative;
  z-index: 2;
}

.progress-step.active {
  color: var(--primary-dark);
}

.progress-step.active .step-circle {
  background-color: var(--primary-light);
  color: #ffffff;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 4px var(--primary-light-bg);
}

.step-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--surface-color);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.step-line {
  flex-grow: 1;
  height: 2px;
  background-color: var(--border-color);
  margin: -1.5rem 1rem 0 1rem;
  z-index: 1;
}

.cart-header {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .cart-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.page-title {
  font-size: 1.75rem;
  color: var(--primary-dark);
  margin: 0 0 0.5rem 0;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.item-count {
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
}

.empty-state {
  background-color: var(--surface-color);
  border-radius: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-state svg {
  width: 4rem;
  height: 4rem;
  color: var(--border-color);
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-muted);
  margin: 0 0 2rem 0;
}

.btn-primary {
  display: inline-block;
  background-color: var(--primary-light);
  color: #ffffff;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  text-align: center;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-primary.full-width {
  width: 100%;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: flex-start;
}

@media (min-width: 992px) {
  .cart-layout {
    grid-template-columns: 1.8fr 1fr;
  }
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  background-color: var(--surface-color);
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

@media (min-width: 640px) {
  .cart-item {
    flex-direction: row;
    align-items: center;
  }
}

.remove-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.remove-btn:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

.remove-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.item-image {
  width: 80px;
  height: 80px;
  background-color: var(--surface-hover);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  padding: 0.5rem;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-placeholder {
  color: var(--border-color);
}

.image-placeholder svg {
  width: 2rem;
  height: 2rem;
}

.item-details {
  flex-grow: 1;
  padding-right: 2rem;
}

.item-brand {
  display: inline-block;
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.65rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}

.item-name {
  font-size: 1rem;
  color: var(--text-main);
  margin: 0 0 0.25rem 0;
  font-weight: 700;
  line-height: 1.3;
}

.item-unit-price {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

@media (min-width: 640px) {
  .item-actions {
    border-top: none;
    padding-top: 0;
    justify-content: flex-end;
  }
}

.qty-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  height: 36px;
  overflow: hidden;
}

.qty-controls button {
  width: 32px;
  height: 100%;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-main);
  cursor: pointer;
  transition: background-color 0.2s;
}

.qty-controls button:hover:not(:disabled) {
  background-color: var(--surface-hover);
}

.qty-controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-controls input {
  width: 40px;
  height: 100%;
  text-align: center;
  border: none;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  background-color: var(--surface-color);
}

.item-subtotal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.subtotal-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 0.1rem;
}

.subtotal-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--primary-dark);
}

.cart-summary {
  background-color: var(--surface-color);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  position: sticky;
  top: 6rem;
}

.cart-summary h2 {
  font-size: 1.125rem;
  color: var(--primary-dark);
  margin: 0 0 1.25rem 0;
  font-weight: 800;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--text-main);
}

.text-green {
  color: var(--primary-light);
  font-weight: 600;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed var(--border-color);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
}

.continue-shopping {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.continue-shopping:hover {
  color: var(--primary-light);
}
</style>