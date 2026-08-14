<template>
  <div class="checkout-page">
    <div class="container">
      <div class="checkout-layout">
        <div class="checkout-form-section" v-animate>
          <div class="checkout-header">
            <h1 class="page-title">Finalizar Pedido</h1>
            <router-link to="/carrinho" class="back-link">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao carrinho
            </router-link>
          </div>

          <form @submit.prevent="processCheckout" class="checkout-form">
            <div class="form-section">
              <div class="section-title">
                <span class="step-number">1</span>
                <h2>Dados Pessoais</h2>
              </div>
              <div class="form-grid">
                <div class="input-group full-width">
                  <label for="fullName">Nome Completo</label>
                  <input type="text" id="fullName" v-model="checkoutData.fullName" required>
                </div>
                <div class="input-group">
                  <label for="email">E-mail</label>
                  <input type="email" id="email" v-model="checkoutData.email" required>
                </div>
                <div class="input-group">
                  <label for="cpf">CPF / CNPJ</label>
                  <input type="text" id="cpf" v-model="checkoutData.cpf" required>
                </div>
                <div class="input-group full-width">
                  <label for="phone">Telefone / WhatsApp</label>
                  <input type="text" id="phone" v-model="checkoutData.phone" required>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="section-title">
                <span class="step-number">2</span>
                <h2>Endereço de Entrega</h2>
              </div>
              <div class="form-grid">
                <div class="input-group cep-group">
                  <label for="cep">CEP</label>
                  <div class="cep-wrapper">
                    <input type="text" id="cep" v-model="checkoutData.cep" required maxlength="9">
                    <button type="button" class="btn-search-cep" @click="searchCep" :disabled="cepLoading">
                      {{ cepLoading ? 'Buscando...' : 'Buscar' }}
                    </button>
                  </div>
                  <span v-if="cepError" class="cep-error">{{ cepError }}</span>
                </div>
                <div class="input-group full-width">
                  <label for="street">Logradouro (Rua, Avenida)</label>
                  <input type="text" id="street" v-model="checkoutData.street" required>
                </div>
                <div class="input-group">
                  <label for="number">Número</label>
                  <input type="text" id="number" v-model="checkoutData.number" required>
                </div>
                <div class="input-group">
                  <label for="complement">Complemento</label>
                  <input type="text" id="complement" v-model="checkoutData.complement">
                </div>
                <div class="input-group">
                  <label for="neighborhood">Bairro</label>
                  <input type="text" id="neighborhood" v-model="checkoutData.neighborhood" required>
                </div>
                <div class="input-group">
                  <label for="city">Cidade</label>
                  <input type="text" id="city" v-model="checkoutData.city" required>
                </div>
                <div class="input-group">
                  <label for="state">Estado</label>
                  <input type="text" id="state" v-model="checkoutData.state" required maxlength="2">
                </div>
              </div>
            </div>
            
            <div class="form-section" v-if="shippingOptions.length > 0">
              <div class="section-title">
                <h2>Opções de Entrega</h2>
              </div>
              <div class="shipping-options">
                <label
                  v-for="(option, index) in shippingOptions"
                  :key="option.service"
                  class="shipping-option"
                  :class="{ active: selectedShippingIndex === index }"
                >
                  <input type="radio" :value="index" v-model="selectedShippingIndex">
                  <span>{{ option.service }} — {{ option.days || option.deadline_days }} dias úteis</span>
                  <strong>{{ formatPrice(parseFloat(option.price)) }}</strong>
                </label>
              </div>
            </div>

            <div class="form-section stripe-section">
              <div class="section-title">
                <span class="step-number">3</span>
                <h2>Pagamento Seguro</h2>
              </div>
              
              <div class="stripe-info-card">
                <div class="stripe-icon">
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28.026 13.911c0-6.953-5.267-11.455-12.28-11.455-7.147 0-13.064 4.887-13.064 12.398 0 7.828 6.002 12.185 13.568 12.185 3.993 0 7.37-1.127 9.873-2.903l-1.643-3.693c-2.146 1.408-4.992 2.22-7.854 2.22-4.464 0-8.232-2.159-8.825-6.289h19.98c.157-1.033.245-1.956.245-2.463zm-20.48-1.55c1.066-3.1 4.165-5.322 7.854-5.322 3.658 0 6.645 2.033 7.697 5.323H7.546z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="stripe-text">
                  <h3>Checkout Rápido e Seguro</h3>
                  <p>Você será redirecionado para o ambiente 100% criptografado da <strong>Stripe</strong>. Lá você poderá finalizar sua compra utilizando Cartão de Crédito, Débito ou Boleto Bancário.</p>
                </div>
              </div>
            </div>
            
            <button type="submit" class="btn-submit-mobile" :disabled="isProcessing">
              {{ isProcessing ? 'Redirecionando...' : 'Ir para o Pagamento' }}
            </button>
          </form>
        </div>

        <aside class="order-summary-section" v-animate>
          <div class="summary-card">
            <h3>Resumo do Pedido</h3>
            
            <div class="summary-items">
              <div class="summary-item" v-for="item in cartStore.items" :key="item.id">
                <div class="item-img-wrapper">
                  <img v-if="item.image" :src="item.image" :alt="item.name">
                </div>
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <span class="item-qty">Qtd: {{ item.quantity }}</span>
                </div>
                <div class="item-price">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>

            <div class="summary-lines">
              <div class="summary-line">
                <span>Subtotal</span>
                <span>{{ formatPrice(cartStore.cartTotal) }}</span>
              </div>
              <div class="summary-line">
                <span>Frete</span>
                <span>{{ formatPrice(selectedShippingFee) }}</span>
              </div>
              <div class="summary-line total">
                <span>Total a pagar</span>
                <span>{{ formatPrice(cartStore.cartTotal + selectedShippingFee) }}</span>
              </div>
            </div>

            <button class="btn-submit-desktop" @click="processCheckout" :disabled="isProcessing">
              {{ isProcessing ? 'Redirecionando...' : 'Ir para o Pagamento' }}
              <svg v-if="!isProcessing" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            
            <div class="secure-checkout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Protegido pela Stripe
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'
import { useOrderStore } from '../../stores/orderStore'
import api from '../../services/api'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const isProcessing = ref(false)

const checkoutData = reactive({
  fullName: '',
  email: '',
  cpf: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: ''
})

const cepLoading = ref(false)
const cepError = ref('')
const shippingOptions = ref([])
const selectedShippingIndex = ref(null)

const selectedShippingFee = computed(() => {
  if (selectedShippingIndex.value === null) return 0
  const opt = shippingOptions.value[selectedShippingIndex.value]
  return opt ? parseFloat(opt.price) : 0
})

const searchCep = async () => {
  const cleanCep = checkoutData.cep.replace(/\D/g, '')
  if (cleanCep.length !== 8) {
    cepError.value = 'CEP inválido.'
    return
  }
  cepError.value = ''
  cepLoading.value = true
  shippingOptions.value = []
  
  try {
    const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    const viaCepData = await viaCepResponse.json()
    if (!viaCepData.erro) {
      checkoutData.street = viaCepData.logradouro || ''
      checkoutData.neighborhood = viaCepData.bairro || ''
      checkoutData.city = viaCepData.localidade || ''
      checkoutData.state = viaCepData.uf || ''
    }

    const shippingResponse = await api.post('/orders/shipping/simulate/', {
      cep_destino: cleanCep,
      items: cartStore.items.map(item => ({ product_id: item.id, quantity: item.quantity })),
    })
    shippingOptions.value = shippingResponse.data
    if (shippingOptions.value.length > 0) selectedShippingIndex.value = 0
  } catch (err) {
    cepError.value = 'Não foi possível calcular o frete agora.'
  } finally {
    cepLoading.value = false
  }
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
}

const processCheckout = async () => {
  if (cartStore.items.length === 0) return
  
  // Validação simples de frete[cite: 13]
  if (shippingOptions.value.length > 0 && selectedShippingIndex.value === null) {
    alert('Por favor, selecione uma opção de frete.')
    return
  }

  isProcessing.value = true

  const chosenShipping = shippingOptions.value[selectedShippingIndex.value] || {
    service: 'Frete Padrão', price: 0,
  }

  const orderPayload = {
    customer_name: checkoutData.fullName,
    customer_email: checkoutData.email,
    customer_cpf: checkoutData.cpf,
    customer_phone: checkoutData.phone,
    zip_code: checkoutData.cep,
    street: checkoutData.street,
    number: checkoutData.number,
    complement: checkoutData.complement,
    district: checkoutData.neighborhood,
    city: checkoutData.city,
    state: checkoutData.state,
    shipping_service: chosenShipping.service,
    shipping_fee: chosenShipping.price,
    items: cartStore.items.map(item => ({ product_id: item.id, quantity: item.quantity })),
  }

  // 1. Criação do Pedido no Django[cite: 13]
  const created = await orderStore.createOrder(orderPayload)
  if (!created) {
    alert(orderStore.error || 'Erro ao criar o pedido.')
    isProcessing.value = false
    return
  }

  // 2. Disparo da Requisição para a Stripe e Redirecionamento
  try {
    const response = await api.post(`/orders/${orderStore.lastOrder.id}/pay/`)
    
    if (response.data && response.data.checkout_url) {
      cartStore.clearCart() // Limpa o carrinho antes de ir para a Stripe
      window.location.href = response.data.checkout_url
    } else {
      alert('Não foi possível gerar a sessão de pagamento.')
      isProcessing.value = false
    }
  } catch (err) {
    alert(err.response?.data?.error || 'Erro interno ao processar o pagamento.')
    isProcessing.value = false
  }
}
</script>

<style scoped>
.container { 
  width: 100%; 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 1.25rem; 
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
}

.checkout-page { 
  background-color: var(--bg-color); 
  min-height: 100vh; 
  padding: 2rem 0 5rem 0; 
}

.checkout-layout { 
  display: flex; 
  flex-direction: column; 
  gap: 2rem; 
}

@media (min-width: 992px) { 
  .checkout-layout { 
    flex-direction: row; 
    align-items: flex-start; 
    gap: 3rem;
  } 
}

.checkout-form-section { 
  flex-grow: 1; 
  width: 100%; 
}

.checkout-header { 
  display: flex; 
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem; 
}

@media (min-width: 640px) {
  .checkout-header {
    flex-direction: row;
    justify-content: space-between; 
    align-items: center; 
  }
}

.page-title { 
  font-size: 1.75rem; 
  font-weight: 800; 
  color: var(--text-main); 
  margin: 0; 
}

@media (min-width: 768px) {
  .page-title {
    font-size: 2.25rem;
  }
}

.back-link { 
  display: flex; 
  align-items: center; 
  gap: 0.5rem; 
  color: var(--text-muted); 
  text-decoration: none; 
  font-weight: 600; 
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--primary-light);
}

.back-link svg {
  width: 1.25rem;
  height: 1.25rem;
}

.checkout-form { 
  display: flex; 
  flex-direction: column; 
  gap: 1.5rem; 
}

@media (min-width: 768px) {
  .checkout-form {
    gap: 2.5rem;
  }
}

.form-section { 
  background-color: var(--surface-color); 
  border: 1px solid var(--border-color); 
  border-radius: 1rem; 
  padding: 1.5rem; 
}

@media (min-width: 768px) {
  .form-section {
    padding: 2.5rem;
    border-radius: 1.25rem;
  }
}

.section-title { 
  display: flex; 
  align-items: center; 
  gap: 1rem; 
  margin-bottom: 1.5rem; 
  padding-bottom: 1rem; 
  border-bottom: 1px solid var(--border-color); 
}

.section-title h2 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-main);
}

@media (min-width: 768px) {
  .section-title h2 {
    font-size: 1.5rem;
  }
}

.step-number { 
  width: 2.25rem; 
  height: 2.25rem; 
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%);
  color: white; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: 800; 
  font-size: 1rem;
  flex-shrink: 0;
}

.form-grid { 
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 1.25rem; 
}

@media (min-width: 640px) { 
  .form-grid { 
    grid-template-columns: 1fr 1fr; 
    gap: 1.5rem;
  } 
}

.input-group { 
  display: flex; 
  flex-direction: column; 
  gap: 0.5rem; 
}

.full-width { 
  grid-column: 1 / -1; 
}

.input-group label { 
  font-size: 0.9rem; 
  font-weight: 700; 
  color: var(--text-main); 
}

.input-group input { 
  width: 100%; 
  padding: 0.85rem 1rem; 
  border: 1px solid var(--border-color); 
  border-radius: 0.5rem; 
  box-sizing: border-box; 
  background-color: var(--bg-color);
  color: var(--text-main);
  font-size: 1rem; /* Importante para não dar zoom no iOS */
  outline: none;
  transition: all 0.2s ease;
}

.input-group input:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(0, 168, 89, 0.1);
}

.cep-group {
  grid-column: 1 / -1;
}

@media (min-width: 640px) {
  .cep-group {
    grid-column: span 1;
  }
}

.cep-wrapper { 
  display: flex; 
  gap: 0.5rem; 
}

.btn-search-cep { 
  background-color: var(--primary-light); 
  color: #fff;
  border: none; 
  padding: 0 1.25rem; 
  border-radius: 0.5rem; 
  font-weight: 700; 
  cursor: pointer; 
  transition: background-color 0.2s;
}

.btn-search-cep:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn-search-cep:disabled {
  background-color: var(--border-color);
  color: var(--text-muted);
  cursor: not-allowed;
}

.cep-error {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.25rem;
}

.shipping-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shipping-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--surface-color);
}

.shipping-option:hover {
  border-color: var(--primary-light);
}

.shipping-option.active {
  border-color: var(--primary-light);
  background-color: rgba(0, 168, 89, 0.05);
}

.shipping-option input {
  display: none;
}

.shipping-option span {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}

.shipping-option strong {
  font-size: 1.1rem;
  color: var(--primary-dark);
}

.stripe-info-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(145deg, #f8f9fa 0%, #f1f5f9 100%);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
}

@media (min-width: 640px) {
  .stripe-info-card {
    flex-direction: row;
    text-align: left;
    padding: 2rem;
  }
}

.stripe-icon {
  width: 4rem;
  height: 4rem;
  background-color: #635bff;
  color: #ffffff;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 15px -3px rgba(99, 91, 255, 0.3);
}

.stripe-icon svg {
  width: 2.5rem;
  height: 2.5rem;
}

.stripe-text h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
  font-size: 1.15rem;
  font-weight: 800;
}

.stripe-text p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.stripe-text strong {
  color: #635bff;
}

.order-summary-section { 
  width: 100%; 
}

@media (min-width: 992px) { 
  .order-summary-section { 
    width: 420px; 
    flex-shrink: 0; 
    position: sticky; 
    top: 2rem; 
  } 
}

.summary-card { 
  background-color: var(--surface-color); 
  border: 1px solid var(--border-color); 
  border-radius: 1.25rem; 
  padding: 1.5rem; 
}

@media (min-width: 768px) {
  .summary-card {
    padding: 2rem;
  }
}

.summary-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-items { 
  max-height: 300px; 
  overflow-y: auto; 
  display: flex; 
  flex-direction: column; 
  gap: 1.25rem; 
  margin-bottom: 1.5rem;
  padding-right: 0.5rem;
}

.summary-items::-webkit-scrollbar {
  width: 4px;
}

.summary-items::-webkit-scrollbar-track {
  background: var(--bg-color);
  border-radius: 4px;
}

.summary-items::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.summary-item { 
  display: flex; 
  align-items: center; 
  gap: 1rem; 
}

.item-img-wrapper { 
  width: 60px; 
  height: 60px; 
  background-color: var(--surface-hover); 
  border-radius: 0.5rem; 
  padding: 0.5rem; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
}

.item-img-wrapper img { 
  max-width: 100%; 
  max-height: 100%; 
  object-fit: contain;
}

.item-info {
  flex-grow: 1;
}

.item-info h4 { 
  font-size: 0.9rem; 
  color: var(--text-main);
  margin: 0 0 0.25rem 0; 
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-qty {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

.item-price { 
  font-weight: 800; 
  color: var(--text-main); 
  font-size: 1rem;
}

.summary-lines { 
  border-top: 1px solid var(--border-color); 
  padding-top: 1.5rem; 
  display: flex; 
  flex-direction: column; 
  gap: 1rem; 
}

.summary-line { 
  display: flex; 
  justify-content: space-between; 
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
}

.summary-line.total { 
  font-size: 1.4rem; 
  font-weight: 900; 
  color: var(--primary-dark);
  border-top: 1px dashed var(--border-color); 
  padding-top: 1.25rem; 
  margin-top: 0.5rem;
}

.btn-submit-mobile, .btn-submit-desktop { 
  background-color: var(--primary-light); 
  color: white; 
  border: none; 
  padding: 1.15rem; 
  border-radius: 0.75rem; 
  font-weight: 800; 
  cursor: pointer; 
  text-align: center; 
  width: 100%; 
  font-size: 1.1rem; 
  transition: all 0.3s ease;
}

.btn-submit-mobile:hover:not(:disabled), .btn-submit-desktop:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.btn-submit-mobile:disabled, .btn-submit-desktop:disabled { 
  background-color: var(--border-color);
  color: var(--text-muted);
  cursor: not-allowed; 
}

@media (min-width: 992px) { 
  .btn-submit-mobile { display: none; } 
  .btn-submit-desktop { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 0.75rem; 
    margin-top: 1.5rem;
  } 
  .btn-submit-desktop svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

@media (max-width: 991px) { 
  .btn-submit-desktop { display: none; } 
  .btn-submit-mobile {
    margin-top: 1rem;
  }
}

.secure-checkout { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 0.5rem; 
  font-size: 0.85rem; 
  font-weight: 600;
  color: var(--text-muted); 
  margin-top: 1.5rem; 
}

.secure-checkout svg { 
  width: 1.15rem; 
  height: 1.15rem; 
  color: #635bff; 
}
</style>