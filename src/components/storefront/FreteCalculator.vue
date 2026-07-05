<script setup>
import { ref } from 'vue'
import api from '../../services/api' // Ajuste o path para a sua instância axios

// O componente recebe os itens que serão calculados.
// Exemplo: [{ product_id: 'uuid', quantity: 1 }]
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

// Máscara simples para CEP (00000-000)
const maskCep = () => {
  let v = cep.value.replace(/\D/g, '')
  if (v.length > 5) {
    v = v.replace(/^(\d{5})(\d)/, '$1-$2')
  }
  cep.value = v.slice(0, 9) // limita a 9 caracteres
}

const calcularFrete = async () => {
  // Validação básica do tamanho do CEP
  if (cep.value.replace(/\D/g, '').length !== 8) {
    errorMessage.value = 'Digite um CEP válido com 8 dígitos.'
    return
  }
  
  if (props.items.length === 0) {
    errorMessage.value = 'Nenhum item para calcular.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  results.value = null

  try {
    const response = await api.post('/shipping/calculate/', {
      cep_destino: cep.value,
      items: props.items
    })
    
    // Sucesso, recebemos array [{service: 'PAC', price: '25,00', days: 7}, ...]
    results.value = response.data
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Falha ao se conectar com os Correios. Tente novamente.'
    }
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
      <div v-for="res in results" :key="res.service" class="frete-option">
        <div class="frete-info">
          <span class="frete-service">{{ res.service }}</span>
          <span class="frete-days">Chega em até {{ res.days }} dias úteis</span>
        </div>
        <div class="frete-price">R$ {{ res.price }}</div>
        <div v-if="res.warning" class="frete-warning">{{ res.warning }}</div>
      </div>
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