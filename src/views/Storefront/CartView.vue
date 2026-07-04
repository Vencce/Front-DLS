<script setup>
import { ref } from 'vue'
import api from '../../services/api'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:shipping'])

const cep = ref('')
const options = ref([])
const selectedService = ref(null)
const isLoading = ref(false)
const errorMsg = ref('')

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const formatCep = () => {
  let digits = cep.value.replace(/\D/g, '').slice(0, 8)
  if (digits.length > 5) {
    digits = `${digits.slice(0, 5)}-${digits.slice(5)}`
  }
  cep.value = digits
}

const calcularFrete = async () => {
  errorMsg.value = ''
  options.value = []
  selectedService.value = null
  emit('update:shipping', null)

  const cleanCep = cep.value.replace(/\D/g, '')
  if (cleanCep.length !== 8) {
    errorMsg.value = 'Digite um CEP válido.'
    return
  }

  if (!props.items || props.items.length === 0) {
    errorMsg.value = 'Carrinho vazio.'
    return
  }

  isLoading.value = true
  try {
    const response = await api.post('/orders/shipping/simulate/', {
      zip_code: cleanCep,
      items: props.items
    })
    options.value = response.data
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      errorMsg.value = error.response.data.error
    } else {
      errorMsg.value = 'Não foi possível calcular o frete. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}

const selecionarOpcao = (option) => {
  selectedService.value = option.service
  emit('update:shipping', option)
}
</script>

<template>
  <div class="frete-calculator">
    <label for="cep">Calcular Frete</label>
    <div class="cep-input-group">
      <input
        type="text"
        id="cep"
        v-model="cep"
        @input="formatCep"
        @keyup.enter="calcularFrete"
        placeholder="00000-000"
        maxlength="9"
        :disabled="isLoading"
      >
      <button class="btn-calc" @click="calcularFrete" :disabled="isLoading">
        {{ isLoading ? 'Calculando...' : 'OK' }}
      </button>
    </div>

    <p v-if="errorMsg" class="frete-error">{{ errorMsg }}</p>

    <div v-if="options.length > 0" class="frete-options">
      <label
        v-for="option in options"
        :key="option.service"
        class="frete-option"
        :class="{ selected: selectedService === option.service }"
      >
        <input
          type="radio"
          name="frete-service"
          :checked="selectedService === option.service"
          @change="selecionarOpcao(option)"
        >
        <div class="frete-option-info">
          <span class="frete-service-name">{{ option.service }}</span>
          <span class="frete-service-days">até {{ option.deadline_days }} dia(s) útil(eis)</span>
        </div>
        <span class="frete-service-price">{{ formatPrice(option.price) }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.frete-calculator {
  margin-bottom: 1.5rem;
}

.frete-calculator label[for="cep"] {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.4rem;
}

.cep-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.cep-input-group input {
  flex-grow: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.cep-input-group input:focus {
  border-color: var(--primary-light);
}

.btn-calc {
  background-color: var(--surface-hover);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0 1rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-calc:hover:not(:disabled) {
  background-color: var(--border-color);
}

.btn-calc:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.frete-error {
  font-size: 0.8rem;
  color: #ef4444;
  margin: 0.4rem 0 0 0;
}

.frete-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.frete-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.frete-option:hover {
  border-color: var(--primary-light);
}

.frete-option.selected {
  border-color: var(--primary-light);
  background-color: var(--surface-hover);
}

.frete-option input[type="radio"] {
  flex-shrink: 0;
  accent-color: var(--primary-light);
}

.frete-option-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.frete-service-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}

.frete-service-days {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.frete-service-price {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--primary-dark);
  white-space: nowrap;
}
</style>