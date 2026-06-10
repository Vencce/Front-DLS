<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Meu Carrinho</h1>

      <div v-if="cartStore.items.length === 0" class="empty-cart" v-animate>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2>Sua cesta está vazia</h2>
        <p>Parece que você ainda não adicionou nenhum produto ao carrinho.</p>
        <router-link to="/catalogo" class="btn-primary">Continuar Comprando</router-link>
      </div>

      <div v-else class="cart-layout" v-animate>
        <div class="cart-items-section">
          <div class="cart-items-list">
            <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
              <div class="item-image" @click="goToProduct(item.id)">
                <img v-if="item.image" :src="item.image" :alt="item.name">
                <div v-else class="image-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div class="item-details">
                <div class="item-header">
                  <div>
                    <span class="item-brand">{{ item.brand || 'DLS Auto Peças' }}</span>
                    <h3 class="item-title" @click="goToProduct(item.id)">{{ item.name }}</h3>
                  </div>
                  <button class="remove-btn" @click="cartStore.removeItem(item.id)" title="Remover item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div class="item-actions">
                  <div class="qty-control">
                    <button class="qty-btn" @click="cartStore.updateQuantity(item.id, item.quantity - 1)" :disabled="item.quantity <= 1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>
                    </button>
                    <span class="qty-display">{{ item.quantity }}</span>
                    <button class="qty-btn" @click="cartStore.updateQuantity(item.id, item.quantity + 1)">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                    </button>
                  </div>
                  
                  <div class="item-price-wrap">
                    <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
                    <span class="item-unit-price" v-if="item.quantity > 1">{{ formatPrice(item.price) }} / un</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-summary-section">
          <div class="summary-card">
            <h3>Resumo do Pedido</h3>
            
            <div class="shipping-calculator">
              <label for="cep">Calcular Frete e Prazo</label>
              <div class="cep-input-group">
                <input type="text" id="cep" v-model="cep" placeholder="00000-000" maxlength="9">
                <button class="btn-calc">Calcular</button>
              </div>
              <span class="free-shipping-msg">Frete Grátis acima de R$ 500,00</span>
            </div>

            <div class="summary-lines">
              <div class="summary-line">
                <span>Subtotal ({{ cartStore.totalItems }} itens)</span>
                <span>{{ formatPrice(cartStore.cartTotal) }}</span>
              </div>
              <div class="summary-line">
                <span>Descontos</span>
                <span class="discount">- R$ 0,00</span>
              </div>
              <div class="summary-line">
                <span>Frete</span>
                <span>A calcular</span>
              </div>
              <div class="summary-line total">
                <span>Total</span>
                <span>{{ formatPrice(cartStore.cartTotal) }}</span>
              </div>
            </div>

            <button class="btn-checkout" @click="goToCheckout">
              Finalizar Compra
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            
            <router-link to="/catalogo" class="btn-continue">
              Continuar Comprando
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()
const cep = ref('')

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const goToProduct = (id) => {
  router.push(`/produto/${id}`)
}

const goToCheckout = () => {
  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding: 2rem 0 5rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 2rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1.5rem;
  background-color: var(--surface-color);
  border-radius: 1.5rem;
  border: 1px dashed var(--border-color);
  text-align: center;
}

.empty-cart svg {
  width: 5rem;
  height: 5rem;
  color: var(--border-color);
  margin-bottom: 1.5rem;
}

.empty-cart h2 {
  font-size: 1.75rem;
  color: var(--text-main);
  margin-bottom: 0.75rem;
  font-weight: 800;
}

.empty-cart p {
  color: var(--text-muted);
  font-size: 1.05rem;
  margin-bottom: 2rem;
  max-width: 400px;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 992px) {
  .cart-layout {
    grid-template-columns: 1.8fr 1.2fr;
  }
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cart-item {
  display: flex;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.25rem;
  gap: 1.25rem;
  transition: box-shadow 0.2s ease;
}

.cart-item:hover {
  box-shadow: var(--shadow-sm);
  border-color: var(--primary-light);
}

@media (max-width: 640px) {
  .cart-item {
    flex-direction: column;
  }
}

.item-image {
  width: 120px;
  height: 120px;
  background-color: var(--surface-hover);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  padding: 1rem;
}

@media (max-width: 640px) {
  .item-image {
    width: 100%;
    height: 180px;
  }
}

.item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.item-image:hover img {
  transform: scale(1.05);
}

.image-placeholder {
  color: var(--border-color);
}

.image-placeholder svg {
  width: 2.5rem;
  height: 2.5rem;
}

.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.item-brand {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.25rem;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.2s ease;
}

.item-title:hover {
  color: var(--primary-light);
}

.remove-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background-color: #fef2f2;
  border-color: #fecaca;
  color: #ef4444;
}

.remove-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.qty-control {
  display: flex;
  align-items: center;
  background-color: var(--surface-hover);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.qty-btn {
  background: none;
  border: none;
  color: var(--text-main);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background-color: var(--border-color);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-btn svg {
  width: 1.1rem;
  height: 1.1rem;
}

.qty-display {
  color: var(--text-main);
  font-weight: 700;
  font-size: 1rem;
  width: 40px;
  text-align: center;
}

.item-price-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.item-price {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--primary-dark);
}

.item-unit-price {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.summary-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  position: sticky;
  top: 2rem;
}

.summary-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.shipping-calculator {
  margin-bottom: 2rem;
}

.shipping-calculator label {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.cep-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.cep-input-group input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.cep-input-group input:focus {
  border-color: var(--primary-light);
}

.btn-calc {
  background-color: var(--surface-hover);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-calc:hover {
  background-color: var(--border-color);
}

.free-shipping-msg {
  font-size: 0.8rem;
  color: var(--primary-light);
  font-weight: 600;
}

.summary-lines {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: var(--text-main);
}

.summary-line .discount {
  color: #ef4444;
  font-weight: 600;
}

.summary-line.total {
  font-size: 1.25rem;
  font-weight: 800;
  margin-top: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed var(--border-color);
}

.btn-primary, .btn-checkout {
  width: 100%;
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 1.25rem;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary:hover, .btn-checkout:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.btn-primary svg, .btn-checkout svg {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-continue {
  display: block;
  text-align: center;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-continue:hover {
  color: var(--primary-light);
  background-color: var(--surface-hover);
}
</style>