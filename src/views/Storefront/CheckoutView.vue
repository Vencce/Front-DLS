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
      
      <button type="submit" class="btn-submit" :disabled="isLoading">
        <span v-if="isLoading">Processando...</span>
        <span v-else>Ir para o Pagamento</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
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

const createOrder = async () => {
  isLoading.value = true
  
  // Utilização do optional chaining (?.) para evitar o erro de undefined
  form.items = cartStore.items.map(item => ({
    product: item.product?.id || item.id,
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
</style>