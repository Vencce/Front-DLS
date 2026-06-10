<template>
  <div class="checkout-page">
    <div class="container checkout-layout">
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
                  <button type="button" class="btn-search-cep">Buscar</button>
                </div>
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
                <select id="state" v-model="checkoutData.state" required>
                  <option value="" disabled>Selecione</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">
              <span class="step-number">3</span>
              <h2>Método de Pagamento</h2>
            </div>
            <div class="payment-methods">
              <label class="payment-option" :class="{ 'active': checkoutData.paymentMethod === 'pix' }">
                <input type="radio" name="payment" value="pix" v-model="checkoutData.paymentMethod">
                <div class="option-content">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <div class="option-text">
                    <span class="option-title">PIX</span>
                    <span class="option-desc">Aprovação imediata (5% OFF)</span>
                  </div>
                </div>
              </label>

              <label class="payment-option" :class="{ 'active': checkoutData.paymentMethod === 'credit_card' }">
                <input type="radio" name="payment" value="credit_card" v-model="checkoutData.paymentMethod">
                <div class="option-content">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <div class="option-text">
                    <span class="option-title">Cartão de Crédito</span>
                    <span class="option-desc">Em até 12x sem juros</span>
                  </div>
                </div>
              </label>

              <label class="payment-option" :class="{ 'active': checkoutData.paymentMethod === 'boleto' }">
                <input type="radio" name="payment" value="boleto" v-model="checkoutData.paymentMethod">
                <div class="option-content">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <div class="option-text">
                    <span class="option-title">Boleto Bancário</span>
                    <span class="option-desc">Aprovação em até 2 dias úteis</span>
                  </div>
                </div>
              </label>
            </div>

            <div v-if="checkoutData.paymentMethod === 'credit_card'" class="credit-card-form form-grid">
              <div class="input-group full-width">
                <label for="cardNumber">Número do Cartão</label>
                <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" required>
              </div>
              <div class="input-group full-width">
                <label for="cardName">Nome Impresso no Cartão</label>
                <input type="text" id="cardName" placeholder="Ex: JOAO DA SILVA" required>
              </div>
              <div class="input-group">
                <label for="cardExpiry">Validade (MM/AA)</label>
                <input type="text" id="cardExpiry" placeholder="12/29" required>
              </div>
              <div class="input-group">
                <label for="cardCvv">CVV</label>
                <input type="text" id="cardCvv" placeholder="123" required>
              </div>
              <div class="input-group full-width">
                <label for="installments">Parcelas</label>
                <select id="installments" required>
                  <option value="1">1x de {{ formatPrice(cartStore.cartTotal) }} sem juros</option>
                  <option value="2">2x de {{ formatPrice(cartStore.cartTotal / 2) }} sem juros</option>
                  <option value="3">3x de {{ formatPrice(cartStore.cartTotal / 3) }} sem juros</option>
                  <option value="6">6x de {{ formatPrice(cartStore.cartTotal / 6) }} sem juros</option>
                  <option value="12">12x de {{ formatPrice(cartStore.cartTotal / 12) }} sem juros</option>
                </select>
              </div>
            </div>
          </div>
          
          <button type="submit" class="btn-submit-mobile">Confirmar e Pagar</button>
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
              <span>Frete (Transportadora)</span>
              <span>R$ 45,90</span>
            </div>
            <div class="summary-line discount" v-if="checkoutData.paymentMethod === 'pix'">
              <span>Desconto PIX (5%)</span>
              <span>- {{ formatPrice(cartStore.cartTotal * 0.05) }}</span>
            </div>
            <div class="summary-line total">
              <span>Total a pagar</span>
              <span v-if="checkoutData.paymentMethod === 'pix'">{{ formatPrice((cartStore.cartTotal * 0.95) + 45.90) }}</span>
              <span v-else>{{ formatPrice(cartStore.cartTotal + 45.90) }}</span>
            </div>
          </div>

          <button class="btn-submit-desktop" @click="processCheckout">
            Confirmar e Pagar
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          
          <div class="secure-checkout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Ambiente 100% Seguro e Criptografado
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

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
  state: '',
  paymentMethod: 'pix'
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const processCheckout = () => {
  if (cartStore.items.length === 0) return
  alert('Pedido processado com sucesso! (Integração com backend em breve)')
  cartStore.clearCart()
  router.push('/')
}

onMounted(() => {
  if (cartStore.items.length === 0) {
    router.push('/carrinho')
  }
  
  if (authStore.user) {
    checkoutData.fullName = authStore.user.first_name || ''
    checkoutData.email = authStore.user.email || ''
  }
})
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  box-sizing: border-box;
}

.checkout-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding: 2rem 0 5rem 0;
  overflow-x: hidden;
}

.checkout-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-sizing: border-box;
}

@media (min-width: 992px) {
  .checkout-layout {
    flex-direction: row;
    align-items: flex-start;
  }
}

.checkout-form-section {
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
}

.checkout-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.2s ease;
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
  gap: 2rem;
  width: 100%;
}

.form-section {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .form-section {
    padding: 2rem;
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

.step-number {
  width: 2rem;
  height: 2rem;
  background-color: var(--primary-light);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
}

.section-title h2 {
  font-size: 1.25rem;
  color: var(--text-main);
  margin: 0;
  font-weight: 800;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  width: 100%;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.input-group input:focus,
.input-group select:focus {
  border-color: var(--primary-light);
}

.cep-wrapper {
  display: flex;
  gap: 0.5rem;
}

.btn-search-cep {
  background-color: var(--surface-hover);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-search-cep:hover {
  background-color: var(--border-color);
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.payment-option {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--bg-color);
}

.payment-option:hover {
  border-color: var(--text-muted);
}

.payment-option.active {
  border-color: var(--primary-light);
  background-color: var(--primary-light-bg);
}

.payment-option input {
  position: absolute;
  opacity: 0;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.option-content svg {
  width: 2rem;
  height: 2rem;
  color: var(--primary-light);
  flex-shrink: 0;
}

.option-text {
  display: flex;
  flex-direction: column;
}

.option-title {
  font-weight: 700;
  color: var(--text-main);
  font-size: 1rem;
}

.option-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.credit-card-form {
  padding-top: 1.5rem;
  border-top: 1px dashed var(--border-color);
}

.btn-submit-mobile {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 1.25rem;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  display: block;
  text-align: center;
}

@media (min-width: 992px) {
  .btn-submit-mobile {
    display: none;
  }
}

.order-summary-section {
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 992px) {
  .order-summary-section {
    width: 400px;
    flex-shrink: 0;
  }
}

.summary-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

@media (min-width: 992px) {
  .summary-card {
    position: sticky;
    top: 2rem;
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-img-wrapper {
  width: 50px;
  height: 50px;
  background-color: var(--surface-hover);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  flex-shrink: 0;
}

.item-img-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.item-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.item-info h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 0.25rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-qty {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.item-price {
  font-weight: 700;
  color: var(--primary-dark);
  font-size: 0.9rem;
}

.summary-lines {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: var(--text-main);
}

.summary-line.discount {
  color: var(--primary-light);
  font-weight: 600;
}

.summary-line.total {
  font-size: 1.25rem;
  font-weight: 800;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border-color);
}

.btn-submit-desktop {
  display: none;
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
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 992px) {
  .btn-submit-desktop {
    display: flex;
  }
}

.btn-submit-desktop:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.btn-submit-desktop svg {
  width: 1.25rem;
  height: 1.25rem;
}

.secure-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.secure-checkout svg {
  width: 1rem;
  height: 1rem;
  color: var(--primary-light);
}
</style>