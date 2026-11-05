<template>
  <div class="checkout-page">
    <div class="checkout-head">
      <h1>Finalizar compra</h1>
      <p>Confira seus dados e o frete antes de seguir para o pagamento.</p>
    </div>

    <form @submit.prevent="createOrder" class="checkout-grid">
      <div class="checkout-fields">
        <section class="form-section">
          <h2>Seus dados</h2>
          <div class="field-grid">
            <div class="form-group span-2">
              <label>Nome completo</label>
              <input type="text" v-model="form.customer_name" required />
            </div>
            <div class="form-group">
              <label>E-mail</label>
              <input type="email" v-model="form.customer_email" required />
            </div>
            <div class="form-group">
              <label>Telefone</label>
              <input type="text" v-model="form.customer_phone" required />
            </div>
            <div class="form-group">
              <label>CPF</label>
              <input type="text" v-model="form.customer_cpf" required />
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>Endereço de entrega</h2>
          <div class="field-grid">
            <div class="form-group span-2">
              <label>CEP</label>
              <div class="cep-row">
                <input type="text" v-model="form.zip_code" @input="onCepInput"
                       maxlength="9" placeholder="00000-000" required />
                <button type="button" class="btn-calc" @click="calcularFrete"
                        :disabled="loadingFrete">
                  {{ loadingFrete ? 'Calculando...' : 'Calcular frete' }}
                </button>
              </div>
            </div>

            <div class="form-group span-2">
              <label>Rua</label>
              <input type="text" v-model="form.street" required />
            </div>
            <div class="form-group">
              <label>Número</label>
              <input type="text" v-model="form.number" required />
            </div>

            <div class="form-group span-2">
              <label>Bairro</label>
              <input type="text" v-model="form.district" required />
            </div>
            <div class="form-group">
              <label>Complemento</label>
              <input type="text" v-model="form.complement" />
            </div>

            <div class="form-group span-2">
              <label>Cidade</label>
              <input type="text" v-model="form.city" required />
            </div>
            <div class="form-group">
              <label>UF</label>
              <input type="text" v-model="form.state" maxlength="2" required />
            </div>
          </div>

          <p v-if="erroFrete" class="field-error">{{ erroFrete }}</p>

          <div v-if="opcoesFrete.length" class="shipping-options">
            <label v-for="op in opcoesFrete" :key="op.service_id"
                   class="shipping-option" :class="{ selected: freteSelecionado?.service_id === op.service_id }">
              <input type="radio" :value="op.service_id"
                     :checked="freteSelecionado?.service_id === op.service_id"
                     @change="freteSelecionado = op" />
              <span class="option-name">{{ op.service }}</span>
              <span class="option-deadline">{{ op.deadline_days }} dia(s) úteis</span>
              <span class="option-price">{{ formatPrice(op.price) }}</span>
            </label>
          </div>
        </section>
      </div>

      <aside class="checkout-summary">
        <div class="summary-card">
          <h2>Resumo do pedido</h2>

          <div class="summary-line">
            <span>Subtotal</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="summary-line">
            <span>Frete</span>
            <span>{{ freteSelecionado ? formatPrice(freteSelecionado.price) : '--' }}</span>
          </div>
          <div class="summary-line total">
            <span>Total</span>
            <span>{{ formatPrice(total) }}</span>
          </div>

          <button type="submit" class="btn-submit" :disabled="isLoading || !freteSelecionado">
            <span v-if="isLoading">Processando...</span>
            <span v-else-if="!freteSelecionado">Calcule o frete para continuar</span>
            <span v-else>Ir para o pagamento</span>
          </button>

          <p v-if="erroPedido" class="field-error">{{ erroPedido }}</p>
        </div>
      </aside>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import api from '@/services/api'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()

const form = reactive({
  customer_name: '', customer_email: '', customer_phone: '', customer_cpf: '',
  zip_code: '', street: '', number: '', district: '', complement: '',
  city: '', state: '',
})

const isLoading = ref(false)
const loadingFrete = ref(false)
const opcoesFrete = ref([])
const freteSelecionado = ref(null)
const erroFrete = ref('')
const erroPedido = ref('')

const formatPrice = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const subtotal = computed(() => cartStore.cartTotal)
const total = computed(() => subtotal.value + (freteSelecionado.value?.price || 0))

const payloadItems = () => cartStore.items.map(i => ({
  product_id: i.id,
  quantity: i.quantity || 1,
}))

const onCepInput = () => {
  let d = form.zip_code.replace(/\D/g, '').slice(0, 8)
  if (d.length > 5) d = `${d.slice(0, 5)}-${d.slice(5)}`
  form.zip_code = d
  limparFrete()
}

const limparFrete = () => {
  opcoesFrete.value = []
  freteSelecionado.value = null
  erroFrete.value = ''
}

watch(() => cartStore.items, limparFrete, { deep: true })

const calcularFrete = async () => {
  erroFrete.value = ''
  opcoesFrete.value = []
  freteSelecionado.value = null

  const cep = form.zip_code.replace(/\D/g, '')
  if (cep.length !== 8) { erroFrete.value = 'Informe um CEP com 8 dígitos.'; return }
  if (!cartStore.items.length) { erroFrete.value = 'Seu carrinho está vazio.'; return }

  loadingFrete.value = true
  try {
    const { data } = await api.post('/orders/shipping/simulate/', {
      zip_code: cep,
      items: payloadItems(),
    })
    opcoesFrete.value = data
    if (data.length) freteSelecionado.value = data[0]
  } catch (err) {
    erroFrete.value = err.response?.data?.error || 'Não foi possível calcular o frete.'
  } finally {
    loadingFrete.value = false
  }
}

const createOrder = async () => {
  if (!freteSelecionado.value) return
  erroPedido.value = ''
  isLoading.value = true
  try {
    const { data } = await api.post('/orders/', {
      ...form,
      zip_code: form.zip_code.replace(/\D/g, ''),
      shipping_service_id: freteSelecionado.value.service_id,
      items: payloadItems(),
    })
    if (data.invoice_url) {
      cartStore.clearCart()
      window.location.href = data.invoice_url
    } else {
      erroPedido.value = 'Pedido criado, mas o link de pagamento não foi gerado.'
    }
  } catch (err) {
    const d = err.response?.data
    const msgItens = Array.isArray(d?.items) ? d.items[0] : d?.items
    erroPedido.value = d?.shipping || d?.error || msgItens ||
      'Não foi possível finalizar o pedido. Verifique os dados.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  max-width: 1060px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.checkout-head {
  margin-bottom: 2rem;
}

.checkout-head h1 {
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-main, #1f2937);
}

.checkout-head p {
  margin: 0;
  color: var(--text-muted, #6b7280);
  font-size: 0.95rem;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

.checkout-fields {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  min-width: 0;
}

.form-section {
  background-color: var(--surface-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.form-section h2 {
  margin: 0 0 1.25rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--primary-dark, #004d28);
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group.span-2 {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main, #374151);
}

.form-group input {
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background-color: var(--bg-color, #f9fafb);
  color: var(--text-main, #1f2937);
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-light, #008f4c);
  box-shadow: 0 0 0 3px rgba(0, 143, 76, 0.15);
}

.cep-row {
  display: flex;
  gap: 0.6rem;
}

.cep-row input {
  flex: 1;
}

.btn-calc {
  padding: 0 1.1rem;
  background-color: var(--primary-light, #008f4c);
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.btn-calc:hover:not(:disabled) {
  background-color: var(--primary-hover, #00733c);
}

.btn-calc:disabled {
  background-color: var(--text-muted, #9ca3af);
  cursor: not-allowed;
}

.field-error {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0.9rem 0 0;
}

.shipping-options {
  margin-top: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.shipping-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.shipping-option:hover {
  border-color: var(--primary-light, #008f4c);
}

.shipping-option.selected {
  border-color: var(--primary-light, #008f4c);
  background-color: var(--surface-hover, #f0faf4);
}

.shipping-option input[type="radio"] {
  accent-color: var(--primary-light, #008f4c);
  flex-shrink: 0;
}

.option-name {
  font-weight: 700;
  color: var(--text-main, #1f2937);
}

.option-deadline {
  flex: 1;
  font-size: 0.85rem;
  color: var(--text-muted, #6b7280);
}

.option-price {
  font-weight: 800;
  color: var(--primary-dark, #004d28);
}

.checkout-summary {
  min-width: 0;
}

.summary-card {
  background-color: var(--surface-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.summary-card h2 {
  margin: 0 0 1.1rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--primary-dark, #004d28);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.92rem;
  color: var(--text-main, #374151);
}

.summary-line.total {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-main, #111827);
  border-top: 1px dashed var(--border-color, #e5e7eb);
  margin-top: 0.4rem;
  padding-top: 0.9rem;
}

.btn-submit {
  width: 100%;
  margin-top: 1.4rem;
  padding: 0.95rem;
  background-color: var(--primary-light, #008f4c);
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--primary-hover, #00733c);
}

.btn-submit:disabled {
  background-color: var(--text-muted, #9ca3af);
  cursor: not-allowed;
}

@media (min-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr 340px;
  }

  .checkout-summary {
    position: sticky;
    top: 2rem;
  }
}

@media (max-width: 640px) {
  .field-grid {
    grid-template-columns: 1fr;
  }

  .form-group.span-2 {
    grid-column: auto;
  }
}
</style>