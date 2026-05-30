<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="page-title" v-animate>Finalizar Compra</h1>

      <div v-if="orderSuccess" class="success-message" v-animate>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2>Pedido Realizado com Sucesso!</h2>
        <p>Acompanhe o status na sua área de cliente.</p>
        <router-link to="/minha-conta" class="btn-primary">Acessar Minha Conta</router-link>
      </div>

      <div v-else class="checkout-layout">
        <form class="checkout-forms" @submit.prevent="submitOrder">
          <section class="checkout-section" v-animate>
            <div class="section-header">
              <span class="step-number">1</span>
              <h2>Dados Pessoais</h2>
            </div>
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="email">E-mail</label>
                <input type="email" id="email" v-model="formData.customer_email" required>
              </div>
              <div class="form-group full-width">
                <label for="nome">Nome Completo</label>
                <input type="text" id="nome" v-model="formData.customer_name" required>
              </div>
              <div class="form-group">
                <label for="cpf">CPF / CNPJ</label>
                <input type="text" id="cpf" v-model="formData.customer_cpf" required>
              </div>
            </div>
          </section>

          <section class="checkout-section" v-animate>
            <div class="section-header">
              <span class="step-number">2</span>
              <h2>Entrega</h2>
            </div>
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="cep">CEP</label>
                <div class="cep-input-group">
                  <input type="text" id="cep" v-model="formData.zip_code" maxlength="9" required>
                  <button type="button" class="btn-secondary" @click="simulateShipping">Buscar CEP</button>
                </div>
              </div>
              <div class="form-group full-width">
                <label for="endereco">Endereço Completo</label>
                <input type="text" id="endereco" v-model="formData.address" required>
              </div>
            </div>

            <div class="shipping-options" v-if="shippingOptions.length > 0">
              <h3>Opções de Frete</h3>
              <label class="shipping-radio" v-for="(option, index) in shippingOptions" :key="index">
                <input 
                  type="radio" 
                  name="frete" 
                  :value="option" 
                  v-model="selectedShipping"
                  @change="updateShippingFee(option)"
                >
                <span class="radio-custom"></span>
                <div class="shipping-info">
                  <span class="shipping-name">{{ option.service }}</span>
                  <span class="shipping-time">Até {{ option.deadline_days }} dias úteis</span>
                </div>
                <span class="shipping-price">{{ formatPrice(parseFloat(option.price)) }}</span>
              </label>
            </div>
          </section>

          <section class="checkout-section" v-animate>
            <div class="section-header">
              <span class="step-number">3</span>
              <h2>Pagamento</h2>
            </div>

            <div class="payment-tabs">
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: paymentMethod === 'pix' }"
                @click="paymentMethod = 'pix'"
              >
                PIX (5% OFF)
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: paymentMethod === 'cartao' }"
                @click="paymentMethod = 'cartao'"
              >
                Cartão de Crédito
              </button>
            </div>

            <div class="payment-content" v-if="paymentMethod === 'pix'">
              <div class="pix-info">
                <p>O QR Code e o código "Copia e Cola" serão gerados após a finalização do pedido.</p>
                <p>O pagamento é processado instantaneamente em ambiente seguro.</p>
              </div>
            </div>

            <div class="payment-content" v-if="paymentMethod === 'cartao'">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="numero_cartao">Número do Cartão</label>
                  <input type="text" id="numero_cartao">
                </div>
                <div class="form-group full-width">
                  <label for="nome_cartao">Nome Impresso no Cartão</label>
                  <input type="text" id="nome_cartao">
                </div>
                <div class="form-group">
                  <label for="validade">Validade (MM/AA)</label>
                  <input type="text" id="validade">
                </div>
                <div class="form-group">
                  <label for="cvv">CVV</label>
                  <input type="text" id="cvv" maxlength="4">
                </div>
              </div>
            </div>
            
            <div v-if="orderStore.error" class="error-alert">
              {{ orderStore.error }}
            </div>
            
            <button type="submit" class="place-order-btn" :disabled="orderStore.loading || cartStore.items.length === 0">
              {{ orderStore.loading ? 'Processando...' : 'Finalizar Pedido Seguramente' }}
            </button>
          </section>
        </form>

        <aside class="order-summary-sidebar" v-animate>
          <div class="summary-card">
            <h2>Resumo do Pedido</h2>
            
            <div class="summary-items">
              <div class="summary-item" v-for="item in cartStore.items" :key="item.id">
                <div class="item-name-qty">
                  <span class="qty">{{ item.quantity }}x</span>
                  <span class="name">{{ item.name }}</span>
                </div>
                <span class="price">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="summary-totals">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>{{ formatPrice(cartStore.cartTotal) }}</span>
              </div>
              <div class="totals-row">
                <span>Frete</span>
                <span>{{ formatPrice(formData.shipping_fee) }}</span>
              </div>
              <div class="totals-row discount" v-if="paymentMethod === 'pix'">
                <span>Desconto PIX (5%)</span>
                <span>- {{ formatPrice(cartStore.cartTotal * 0.05) }}</span>
              </div>
            </div>

            <div class="final-total">
              <span>Total a Pagar</span>
              <span>{{ formatPrice(calculateFinalTotal()) }}</span>
            </div>
            
            <div class="security-badges">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Pagamento 100% Seguro</span>
              <span>Ambiente Criptografado</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'
import { useOrderStore } from '../../stores/orderStore'
import api from '../../services/api'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const paymentMethod = ref('pix')
const shippingOptions = ref([])
const selectedShipping = ref(null)
const orderSuccess = ref(false)

const formData = reactive({
  customer_name: '',
  customer_email: '',
  customer_cpf: '',
  zip_code: '',
  address: '',
  shipping_service: 'Pendente',
  shipping_fee: 0.00
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const calculateFinalTotal = () => {
  let subtotal = cartStore.cartTotal
  let discount = paymentMethod.value === 'pix' ? subtotal * 0.05 : 0
  return subtotal + formData.shipping_fee - discount
}

const simulateShipping = async () => {
  if (!formData.zip_code || cartStore.items.length === 0) return
  
  try {
    const response = await api.post('/orders/shipping/simulate/', {
      zip_code: formData.zip_code.replace(/\D/g, ''),
      items: cartStore.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    })
    shippingOptions.value = response.data
    if (response.data.length > 0) {
      selectedShipping.value = response.data[0]
      updateShippingFee(response.data[0])
    }
  } catch (error) {
    console.error(error)
  }
}

const updateShippingFee = (option) => {
  formData.shipping_service = option.service
  formData.shipping_fee = parseFloat(option.price)
}

const submitOrder = async () => {
  if (cartStore.items.length === 0) return
  
  const payload = {
    ...formData,
    items: cartStore.items.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }))
  }

  const success = await orderStore.createOrder(payload)
  
  if (success) {
    orderSuccess.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.checkout-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-title {
  font-size: 2.25rem;
  color: var(--primary-dark);
  margin: 0 0 2.5rem 0;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.success-message {
  background-color: var(--surface-color);
  border-radius: 1.5rem;
  padding: 5rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.success-message svg {
  width: 5rem;
  height: 5rem;
  color: var(--primary-light);
  background-color: var(--primary-light-bg);
  border-radius: 50%;
  padding: 1rem;
}

.success-message h2 {
  color: var(--text-main);
  font-size: 2rem;
  margin: 0;
}

.success-message p {
  color: var(--text-muted);
  font-size: 1.125rem;
  margin: 0 0 1.5rem 0;
}

.btn-primary {
  background-color: var(--primary-light);
  color: #ffffff;
  padding: 1rem 2.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 800;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: flex-start;
}

@media (min-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1.5fr 1fr;
  }
}

.checkout-forms {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.checkout-section {
  background-color: var(--surface-color);
  border: none;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
  transition: background-color 0.3s ease;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.step-number {
  background-color: var(--primary-light-bg);
  color: var(--primary-light);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.125rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.section-header h2 {
  font-size: 1.5rem;
  color: var(--primary-dark);
  margin: 0;
  font-weight: 700;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text-main);
  outline: none;
  background-color: var(--surface-color);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--primary-light);
}

.cep-input-group {
  display: flex;
  gap: 0.5rem;
}

.cep-input-group input {
  flex-grow: 1;
}

.btn-secondary {
  background-color: var(--surface-hover);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 0 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.shipping-options {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.shipping-options h3 {
  font-size: 1.125rem;
  margin: 0 0 1.25rem 0;
  color: var(--primary-dark);
  font-weight: 700;
}

.shipping-radio {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.shipping-radio:hover {
  border-color: var(--primary-light);
  background-color: var(--surface-hover);
}

.shipping-radio input {
  position: absolute;
  opacity: 0;
}

.radio-custom {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  margin-right: 1rem;
  position: relative;
}

.shipping-radio input:checked ~ .radio-custom {
  border-color: var(--primary-light);
}

.shipping-radio input:checked ~ .radio-custom::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.625rem;
  height: 0.625rem;
  background-color: var(--primary-light);
  border-radius: 50%;
}

.shipping-radio input:checked ~ .shipping-info .shipping-name {
  color: var(--primary-dark);
  font-weight: 700;
}

.shipping-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.shipping-name {
  font-weight: 600;
  color: var(--text-main);
}

.shipping-time {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.shipping-price {
  font-weight: 800;
  color: var(--text-main);
  font-size: 1.125rem;
}

.payment-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-btn {
  flex: 1;
  padding: 1.25rem;
  background-color: var(--surface-hover);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background-color: var(--border-color);
  color: var(--text-main);
}

.tab-btn.active {
  background-color: var(--primary-light-bg);
  border-color: var(--primary-light);
  color: var(--primary-light);
}

.pix-info {
  background-color: var(--primary-light-bg);
  border: 1px solid var(--primary-light);
  padding: 2rem;
  border-radius: 0.5rem;
  color: var(--primary-dark);
  text-align: center;
}

.pix-info p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.error-alert {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.place-order-btn {
  width: 100%;
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 1.125rem;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.place-order-btn:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(0, 168, 89, 0.4);
}

.place-order-btn:disabled {
  background-color: var(--border-color);
  color: var(--text-muted);
  box-shadow: none;
  cursor: not-allowed;
}

.summary-card {
  background-color: var(--surface-color);
  border: none;
  border-radius: 1rem;
  padding: 2.5rem;
  position: sticky;
  top: 6rem;
  box-shadow: var(--shadow-sm);
}

.summary-card h2 {
  font-size: 1.25rem;
  color: var(--primary-dark);
  margin: 0 0 1.5rem 0;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 800;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.95rem;
}

.item-name-qty {
  display: flex;
  gap: 0.5rem;
  padding-right: 1rem;
}

.qty {
  font-weight: 800;
  color: var(--primary-light);
}

.name {
  color: var(--text-main);
  line-height: 1.4;
  font-weight: 500;
}

.price {
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
}

.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.totals-row {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 1rem;
  font-weight: 500;
}

.totals-row.discount {
  color: var(--primary-light);
  font-weight: 700;
}

.final-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 2.5rem;
}

.security-badges {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.security-badges svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-light);
  margin-bottom: 0.25rem;
}
</style>