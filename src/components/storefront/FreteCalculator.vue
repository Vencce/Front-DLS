<script setup>
import { ref } from 'vue'
import api from '../../services/api'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const cep = ref('')
const isLoading = ref(false)
const results = ref(null)
const errorMessage = ref('')

const formatPrice = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)

const maskCep = () => {
  let v = cep.value.replace(/\D/g, '').slice(0, 8)
  if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`
  cep.value = v
  results.value = null
  errorMessage.value = ''
}

const calcularFrete = async () => {
  const cleanCep = cep.value.replace(/\D/g, '')
  if (cleanCep.length !== 8) {
    errorMessage.value = 'Digite um CEP válido com 8 dígitos.'
    return
  }
  if (!props.items.length) {
    errorMessage.value = 'Nenhum item para calcular.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  results.value = null

  try {
    const { data } = await api.post('/orders/shipping/simulate/', {
      zip_code: cleanCep,
      items: props.items
    })
    results.value = data
  } catch (error) {
    errorMessage.value = error.response?.data?.error
      || 'Não foi possível calcular o frete. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="frete-calculator">
    <h3 class="frete-title">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      Calcular Frete e Prazo
    </h3>
    
    <form @submit.prevent="calcularFrete" class="frete-form">
      <input 
        type="text" 
        v-model="cep" 
        @input="maskCep"
        placeholder="Digite seu CEP" 
        class="frete-input"
        :disabled="isLoading"
      />
      <button type="submit" class="frete-button" :disabled="isLoading || cep.length < 9">
        {{ isLoading ? 'Calculando...' : 'Calcular' }}
      </button>
    </form>

    <div v-if="errorMessage" class="frete-error">
      {{ errorMessage }}
    </div>
    <div v-if="results && results.length > 0" class="frete-results">
      <div v-for="res in results" :key="res.service_id" class="frete-option">
        <div class="frete-info">
          <span class="frete-service">{{ res.service }}</span>
          <span class="frete-days">Chega em até {{ res.deadline_days }} dias úteis</span>
        </div>
        <div class="frete-price">{{ formatPrice(res.price) }}</div>
      </div>
    </div>

    <div v-if="results && results.length === 0" class="frete-error">
      Nenhuma entrega disponível para este CEP.
    </div>
  </div>
</template>

<style scoped>
.frete-calculator {
  background-color: var(--surface-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-top: 1.5rem;
}

.frete-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main, #1f2937);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.frete-title svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-light, #10b981);
}

.frete-form {
  display: flex;
  gap: 0.5rem;
}

.frete-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 0.5rem;
  outline: none;
  font-family: inherit;
}

.frete-input:focus {
  border-color: var(--primary-light, #10b981);
}

.frete-button {
  background-color: var(--primary-light, #10b981);
  color: white;
  border: none;
  padding: 0 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.frete-button:hover:not(:disabled) {
  opacity: 0.9;
}

.frete-button:disabled {
  background-color: var(--text-muted, #9ca3af);
  cursor: not-allowed;
}

.frete-error {
  margin-top: 1rem;
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
}

.frete-results {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.frete-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  background-color: var(--bg-color, #f9fafb);
}

.frete-info {
  display: flex;
  flex-direction: column;
}

.frete-service {
  font-weight: 800;
  color: var(--text-main, #1f2937);
  font-size: 0.95rem;
}

.frete-days {
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
}

.frete-price {
  font-weight: 800;
  color: var(--primary-dark, #047857);
  font-size: 1.1rem;
}

.frete-warning {
  width: 100%;
  font-size: 0.75rem;
  color: #f59e0b;
  margin-top: 0.25rem;
}
</style>