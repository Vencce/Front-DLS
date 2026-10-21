<template>
  <div class="checkout-wrapper">
    <h1 class="title">Finalizar Compra</h1>

    <form @submit.prevent="createOrder" class="checkout-form">
      <div class="form-group">
        <label>Nome Completo</label>
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

      <div class="form-group">
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

      <div class="form-group"><label>Rua</label>
        <input type="text" v-model="form.street" required /></div>
      <div class="form-group"><label>Número</label>
        <input type="text" v-model="form.number" required /></div>
      <div class="form-group"><label>Bairro</label>
        <input type="text" v-model="form.district" required /></div>
      <div class="form-group"><label>Complemento</label>
        <input type="text" v-model="form.complement" /></div>
      <div class="form-group"><label>Cidade</label>
        <input type="text" v-model="form.city" required /></div>
      <div class="form-group"><label>UF</label>
        <input type="text" v-model="form.state" maxlength="2" required /></div>

      <p v-if="erroFrete" class="frete-error">{{ erroFrete }}</p>

      <div v-if="opcoesFrete.length" class="form-group">
        <label>Opção de Entrega</label>
        <label v-for="op in opcoesFrete" :key="op.service_id"
               class="frete-option" :class="{ selected: freteSelecionado?.service_id === op.service_id }">
          <input type="radio" :value="op.service_id"
                 :checked="freteSelecionado?.service_id === op.service_id"
                 @change="freteSelecionado = op" />
          <span class="frete-nome">{{ op.service }}</span>
          <span class="frete-prazo">{{ op.deadline_days }} dia(s) úteis</span>
          <span class="frete-preco">{{ formatPrice(op.price) }}</span>
        </label>
      </div>

      <div class="resumo">
        <div class="linha"><span>Subtotal</span><span>{{ formatPrice(subtotal) }}</span></div>
        <div class="linha"><span>Frete</span>
          <span>{{ freteSelecionado ? formatPrice(freteSelecionado.price) : '--' }}</span></div>
        <div class="linha total"><span>Total</span><span>{{ formatPrice(total) }}</span></div>
      </div>

      <button type="submit" class="btn-submit" :disabled="isLoading || !freteSelecionado">
        <span v-if="isLoading">Processando...</span>
        <span v-else-if="!freteSelecionado">Calcule o frete para continuar</span>
        <span v-else>Ir para o Pagamento</span>
      </button>

      <p v-if="erroPedido" class="frete-error">{{ erroPedido }}</p>
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

// Mudou o carrinho? A cotação atual não vale mais.
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
    erroPedido.value = d?.shipping || d?.error ||
      'Não foi possível finalizar o pedido. Verifique os dados.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.checkout-wrapper {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.title {
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #444;
}

.form-group input, .form-group select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #009ee3;
}

.btn-submit {
  margin-top: 16px;
  padding: 14px;
  background-color: #009ee3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #0087c1;
}

.btn-submit:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.cep-row { display: flex; gap: 8px; }
.cep-row input { flex: 1; }
.btn-calc { padding: 0 16px; background: #009ee3; color: #fff; border: none;
  border-radius: 4px; font-weight: bold; cursor: pointer; white-space: nowrap; }
.btn-calc:disabled { background: #ccc; cursor: not-allowed; }
.frete-option { display: flex; align-items: center; gap: 10px; padding: 10px;
  border: 1px solid #ddd; border-radius: 4px; margin-bottom: 6px; cursor: pointer; }
.frete-option.selected { border-color: #009ee3; background: #f0f9ff; }
.frete-nome { font-weight: bold; }
.frete-prazo { color: #666; font-size: 14px; flex: 1; }
.frete-preco { font-weight: bold; color: #047857; }
.frete-error { color: #ef4444; font-size: 14px; margin: 8px 0 0; }
.resumo { border-top: 1px dashed #ddd; padding-top: 12px; margin-top: 8px; }
.resumo .linha { display: flex; justify-content: space-between; padding: 4px 0; }
.resumo .total { font-size: 18px; font-weight: bold; border-top: 1px solid #ddd;
  margin-top: 6px; padding-top: 10px; }
</style>