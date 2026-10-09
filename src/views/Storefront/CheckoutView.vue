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

const form = reactive({
  customer_name: '',
  customer_email: '',
  customer_phone: ''
})

const isLoading = ref(false)

const createOrder = async () => {
  isLoading.value = true
  try {
    const response = await api.post('/orders/', form)
    if (response.data.invoice_url) {
      window.location.href = response.data.invoice_url
    }
  } catch (error) {
    if (error.response) {
      console.error(error.response.data)
      alert(JSON.stringify(error.response.data))
    } else {
      console.error(error.message)
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

.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus {
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