<template>
  <div class="checkout-container">
    <h1 class="checkout-title">Finalizar Compra</h1>

    <div class="checkout-grid">
      <div class="checkout-form-panel">
        <h2>Dados do Cliente</h2>
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
            <label>Código Postal</label>
            <input type="text" v-model="form.zip_code" required />
          </div>
          <div class="form-group">
            <label>Serviço de Entrega</label>
            <select v-model="form.shipping_service" required>
              <option value="PAC">PAC</option>
              <option value="SEDEX">SEDEX</option>
              <option value="TRANSPORTADORA">Transportadora</option>
            </select>
          </div>
        </form>
      </div>

      <div class="checkout-summary-panel">
        <h2>Resumo do Pedido</h2>
        
        <div class="summary-items">
          <div class="summary-item" v-for="(item, index) in cartStore.items" :key="index">
            <span>{{ item.name || item.product?.name || 'Produto' }} (x{{ item.quantity || 1 }})</span>
            <span>R$ {{ getPrice(item).toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="summary-totals">
          <div class="total-line grand-total">
            <span>Total a Pagar</span>
            <span>R$ {{ cartTotal.toFixed(2) }}</span>
          </div>
        </div>

        <button class="checkout-btn" @click="createOrder" :disabled="isLoading">
          <span v-if="isLoading">Processando...</span>
          <span v-else>Pagar com Asaas</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/services/api'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()

const form = reactive({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  customer_cpf: '',
  zip_code: '',
  shipping_service: 'PAC',
  items: []
})

const isLoading = ref(false)

const getPrice = (item) => {
  const price = item.price || item.product?.price || 0
  return Number(price)
}

const cartTotal = computed(() => {
  return cartStore.items.reduce((total, item) => {
    return total + (getPrice(item) * (item.quantity || 1))
  }, 0)
})

const createOrder = async () => {
  isLoading.value = true
  
  form.items = cartStore.items.map(item => ({
    product_id: item.product?.id || item.id, 
    quantity: item.quantity || 1,
    price: item.price || item.product?.price
  }))

  try {
    const response = await api.post('/orders/', form)
    if (response.data.invoice_url) {
      window.location.href = response.data.invoice_url
    }
  } catch (error) {
    if (error.response) {
      alert(JSON.stringify(error.response.data))
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

.checkout-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
  font-weight: bold;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

@media (min-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1.2fr 1fr;
    align-items: start;
  }
}

.checkout-form-panel,
.checkout-summary-panel {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 30px;
  border: 1px solid #f0f0f0;
}

h2 {
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 1.4rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background-color: #f9fafb;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #009ee3;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 158, 227, 0.15);
  outline: none;
}

.summary-items {
  margin-bottom: 25px;
  max-height: 300px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.95rem;
  color: #4b5563;
}

.summary-totals {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
  margin-bottom: 25px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 1rem;
}

.grand-total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #111827;
  margin-top: 15px;
  border-top: 2px dashed #e5e7eb;
  padding-top: 15px;
}

.checkout-btn {
  width: 100%;
  background: #009ee3;
  color: #ffffff;
  border: none;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.checkout-btn:hover:not(:disabled) {
  background: #0087c1;
}

.checkout-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.checkout-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>