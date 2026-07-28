<template>
  <div class="checkout-page">
    <div class="container">
      
      <div v-if="paymentSuccess && pixInfo" class="pix-success-container" v-animate>
        <div class="pix-card">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 class="page-title">Pedido Gerado com Sucesso!</h1>
          <p class="pix-subtitle">Escaneie o QR Code abaixo com o aplicativo do seu banco para finalizar a compra.</p>
          
          <div class="qrcode-wrapper" v-if="pixInfo.qrcode64">
            <img :src="'data:image/png;base64,' + pixInfo.qrcode64" alt="QR Code PIX" />
          </div>

          <div class="pix-copy-paste" v-if="pixInfo.text">
            <label>Ou pague com Pix Copia e Cola:</label>
            <div class="copy-input-group">
              <input type="text" :value="pixInfo.text" readonly ref="pixInputRef" />
              <button type="button" @click="copyPixText" class="btn-copy">
                {{ copyButtonText }}
              </button>
            </div>
          </div>

          <div class="pix-actions">
            <router-link to="/" class="btn-outline">Voltar para a Loja</router-link>
          </div>
        </div>
      </div>

      <div v-else class="checkout-layout">
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
                      {{ cepLoading ? 'Calculando...' : 'Buscar' }}
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
                  <span>{{ option.service }} — {{ option.days }} dias úteis</span>
                  <strong>{{ formatPrice(parseFloat(option.price)) }}</strong>
                </label>
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
              </div>

              <div v-if="checkoutData.paymentMethod === 'credit_card'" class="credit-card-form form-grid">
                <div class="input-group full-width">
                  <label for="cardNumber">Número do Cartão</label>
                  <input type="text" id="cardNumber" v-model="checkoutData.cardNumber" placeholder="0000 0000 0000 0000" required>
                </div>
                <div class="input-group full-width">
                  <label for="cardName">Nome Impresso no Cartão</label>
                  <input type="text" id="cardName" v-model="checkoutData.cardName" placeholder="Ex: JOAO DA SILVA" required>
                </div>
                <div class="input-group">
                  <label for="cardExpiry">Validade (MM/AA)</label>
                  <input type="text" id="cardExpiry" v-model="checkoutData.cardExpiry" placeholder="12/29" required>
                </div>
                <div class="input-group">
                  <label for="cardCvv">CVV</label>
                  <input type="text" id="cardCvv" v-model="checkoutData.cardCvv" placeholder="123" required>
                </div>
                <div class="input-group full-width">
                  <label for="installments">Parcelas</label>
                  <select id="installments" v-model="checkoutData.installments" required>
                    <option value="1">1x de {{ formatPrice(cartStore.cartTotal) }} sem juros</option>
                    <option value="2">2x de {{ formatPrice(cartStore.cartTotal / 2) }} sem juros</option>
                    <option value="3">3x de {{ formatPrice(cartStore.cartTotal / 3) }} sem juros</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button type="submit" class="btn-submit-mobile" :disabled="isProcessing">
              {{ isProcessing ? 'Processando...' : 'Confirmar e Pagar' }}
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
                <span>Frete (Transportadora)</span>
                <span>{{ formatPrice(selectedShippingFee) }}</span>
              </div>
              <div class="summary-line discount" v-if="checkoutData.paymentMethod === 'pix'">
                <span>Desconto PIX (5%)</span>
                <span>- {{ formatPrice(cartStore.cartTotal * 0.05) }}</span>
              </div>
              <div class="summary-line total">
                <span>Total a pagar</span>
                <span v-if="checkoutData.paymentMethod === 'pix'">{{ formatPrice((cartStore.cartTotal * 0.95) + selectedShippingFee) }}</span>
                <span v-else>{{ formatPrice(cartStore.cartTotal + selectedShippingFee) }}</span>
              </div>
            </div>

            <button class="btn-submit-desktop" @click="processCheckout" :disabled="isProcessing">
              {{ isProcessing ? 'Processando...' : 'Confirmar e Pagar' }}
              <svg v-if="!isProcessing" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            
            <div class="secure-checkout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Ambiente 100% Seguro e Criptografado
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

// Variáveis de Estado da Tela do PIX e Processamento
const paymentSuccess = ref(false)
const pixInfo = ref(null)
const pixInputRef = ref(null)
const copyButtonText = ref('Copiar Código')
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
  state: '',
  paymentMethod: 'pix',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
  installments: '1',
})

const cepLoading = ref(false)
const cepError = ref('')
const shippingOptions = ref([])
const selectedShippingIndex = ref(null)

const selectedShippingFee = computed(() => {
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

const detectCardBrand = (number) => {
  const n = number.replace(/\s/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^5[1-5]/.test(n)) return 'mastercard'
  return 'visa' 
}

const buildPaymentPayload = () => {
  if (checkoutData.paymentMethod === 'credit_card') {
    const [expMonth, expYearShort] = checkoutData.cardExpiry.split('/')
    return {
      payment_method: 'card', // Mapeado exatamente como o backend (views.py) espera ('card')
      installments: parseInt(checkoutData.installments),
      card: {
        holder: checkoutData.cardName,
        number: checkoutData.cardNumber.replace(/\s/g, ''),
        expiry_month: expMonth,
        expiry_year: `20${expYearShort}`,
        cvv: checkoutData.cardCvv,
        brand: detectCardBrand(checkoutData.cardNumber),
      },
    }
  }
  
  return { payment_method: 'pix' }
}

const handlePaymentResult = (data) => {
  // Tratamento do retorno de PIX
  if (data.pix || (data.status_code === 2 && checkoutData.paymentMethod === 'pix')) {
    pixInfo.value = data.pix
    paymentSuccess.value = true
    cartStore.clearCart()
    return
  }

  // Tratamento do retorno de Cartão
  if (data.status_code === 8) {
    alert('Pagamento em Cartão aprovado com sucesso!')
    cartStore.clearCart()
    router.push('/')
  } else {
    alert(data.gateway_message || data.status_message || 'Transação não autorizada.')
  }
}

const processCheckout = async () => {
  if (cartStore.items.length === 0) return
  isProcessing.value = true

  const chosenShipping = shippingOptions.value[selectedShippingIndex.value] || {
    service: 'Frete Fixo', price: 45,
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

  // 1. Criação do Pedido no Django
  const created = await orderStore.createOrder(orderPayload)
  if (!created) {
    alert(orderStore.error || 'Erro ao criar o pedido.')
    isProcessing.value = false
    return
  }

  // 2. Disparo da Requisição de Pagamento
  try {
    const paymentPayload = buildPaymentPayload()
    const response = await api.post(`/orders/${orderStore.lastOrder.id}/pay/`, paymentPayload)
    handlePaymentResult(response.data)
  } catch (err) {
    alert(err.response?.data?.error || 'Erro interno ao processar o pagamento.')
  } finally {
    isProcessing.value = false
  }
}

// Copiar código do PIX para a área de transferência
const copyPixText = () => {
  if (pixInfo.value?.text) {
    navigator.clipboard.writeText(pixInfo.value.text).then(() => {
      copyButtonText.value = 'Copiado!'
      setTimeout(() => { copyButtonText.value = 'Copiar Código' }, 3000)
    })
  }
}
</script>

<style scoped>
/* ESTILOS DA TELA DE SUCESSO PIX */
.pix-success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
}

.pix-card {
  background-color: var(--surface-color);
  border: 1px solid var(--primary-light);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 25px -5px rgba(0, 168, 89, 0.15);
}

.success-icon {
  width: 4rem;
  height: 4rem;
  background-color: var(--primary-light-bg, #e6f7ef);
  color: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
}

.success-icon svg {
  width: 2rem;
  height: 2rem;
}

.pix-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.qrcode-wrapper {
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  border: 2px dashed var(--border-color);
  display: inline-block;
  margin-bottom: 2rem;
}

.qrcode-wrapper img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.pix-copy-paste {
  text-align: left;
  margin-bottom: 2rem;
}

.pix-copy-paste label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
  display: block;
}

.copy-input-group {
  display: flex;
  gap: 0.5rem;
}

.copy-input-group input {
  flex-grow: 1;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-muted);
  font-family: monospace;
  font-size: 0.85rem;
  outline: none;
}

.btn-copy {
  background-color: var(--text-main);
  color: #fff;
  border: none;
  padding: 0 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-copy:hover {
  background-color: var(--primary-dark);
}

.pix-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-outline {
  display: block;
  width: 100%;
  padding: 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  color: var(--text-main);
  text-decoration: none;
  font-weight: 700;
  transition: all 0.2s;
}

.btn-outline:hover {
  border-color: var(--text-main);
  background-color: var(--surface-hover);
}

/* ESTILOS BASE DO CHECKOUT */
.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; box-sizing: border-box;}
.checkout-page { background-color: var(--bg-color); min-height: 100vh; padding: 2rem 0; }
.checkout-layout { display: flex; flex-direction: column; gap: 2rem; }
@media (min-width: 992px) { .checkout-layout { flex-direction: row; align-items: flex-start; } }
.checkout-form-section { flex-grow: 1; width: 100%; }
.checkout-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-title { font-size: 1.75rem; font-weight: 800; color: var(--text-main); margin: 0; }
.back-link { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; font-weight: 600; }
.checkout-form { display: flex; flex-direction: column; gap: 2rem; }
.form-section { background-color: var(--surface-color); border: 1px solid var(--border-color); border-radius: 1rem; padding: 1.5rem; }
.section-title { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
.step-number { width: 2rem; height: 2rem; background-color: var(--primary-light); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
.form-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 640px) { .form-grid { grid-template-columns: 1fr 1fr; } }
.input-group { display: flex; flex-direction: column; gap: 0.5rem; }
.full-width { grid-column: 1 / -1; }
.input-group label { font-size: 0.9rem; font-weight: 700; color: var(--text-main); }
.input-group input, .input-group select { width: 100%; padding: 0.875rem 1rem; border: 1px solid var(--border-color); border-radius: 0.5rem; box-sizing: border-box; }
.cep-wrapper { display: flex; gap: 0.5rem; }
.btn-search-cep { background-color: var(--surface-hover); border: 1px solid var(--border-color); padding: 0 1rem; border-radius: 0.5rem; font-weight: 700; cursor: pointer; }
.payment-methods { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
.payment-option { border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.25rem; cursor: pointer; position: relative; }
.payment-option.active { border-color: var(--primary-light); background-color: rgba(0, 168, 89, 0.05); }
.payment-option input { position: absolute; opacity: 0; }
.option-content { display: flex; align-items: center; gap: 1rem; }
.option-content svg { width: 2rem; height: 2rem; color: var(--primary-light); }
.option-title { font-weight: 700; display: block; }
.option-desc { font-size: 0.85rem; color: var(--text-muted); }
.credit-card-form { padding-top: 1.5rem; border-top: 1px dashed var(--border-color); }
.order-summary-section { width: 100%; }
@media (min-width: 992px) { .order-summary-section { width: 400px; flex-shrink: 0; position: sticky; top: 2rem; } }
.summary-card { background-color: var(--surface-color); border: 1px solid var(--border-color); border-radius: 1rem; padding: 1.5rem; }
.summary-items { max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;}
.summary-item { display: flex; align-items: center; gap: 1rem; }
.item-img-wrapper { width: 50px; height: 50px; background-color: var(--surface-hover); border-radius: 0.5rem; padding: 0.25rem; display: flex; align-items: center; justify-content: center;}
.item-img-wrapper img { max-width: 100%; max-height: 100%; }
.item-info h4 { font-size: 0.9rem; margin: 0; }
.item-price { font-weight: 700; color: var(--primary-dark); }
.summary-lines { border-top: 1px solid var(--border-color); padding-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
.summary-line { display: flex; justify-content: space-between; }
.summary-line.total { font-size: 1.25rem; font-weight: 800; border-top: 1px dashed var(--border-color); padding-top: 1rem; margin-top: 0.5rem;}
.btn-submit-mobile, .btn-submit-desktop { background-color: var(--primary-light); color: white; border: none; padding: 1.25rem; border-radius: 0.75rem; font-weight: 800; cursor: pointer; text-align: center; width: 100%; font-size: 1.1rem; }
.btn-submit-mobile:disabled, .btn-submit-desktop:disabled { opacity: 0.7; cursor: not-allowed; }
@media (min-width: 992px) { .btn-submit-mobile { display: none; } .btn-submit-desktop { display: flex; align-items: center; justify-content: center; gap: 0.5rem; } }
@media (max-width: 991px) { .btn-submit-desktop { display: none; } }
.secure-checkout { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-muted); margin-top: 1.25rem; }
.secure-checkout svg { width: 1rem; height: 1rem; color: var(--primary-light); }
</style>