<template>
  <div class="product-detail-page">
    <div class="container">
      <nav class="breadcrumb" v-animate>
        <router-link to="/">Início</router-link>
        <span class="separator">/</span>
        <router-link to="/catalogo">Catálogo</router-link>
        <span class="separator">/</span>
        <span class="current-page">{{ productStore.currentProduct?.name || 'Carregando...' }}</span>
      </nav>

      <div v-if="productStore.loading" class="feedback-state">
        <div class="spinner"></div>
        <p>Carregando detalhes do produto...</p>
      </div>

      <div v-else-if="productStore.error" class="feedback-state error">
        <p>{{ productStore.error }}</p>
        <router-link to="/catalogo" class="back-btn">Voltar ao Catálogo</router-link>
      </div>

      <div v-else-if="productStore.currentProduct" class="product-layout" v-animate>
        <div class="product-gallery">
          <div class="main-image">
            <div v-if="hasImages" class="image-wrapper">
              <img :src="mainImage" :alt="productStore.currentProduct.name" class="product-img">
            </div>
            <div v-else class="image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="thumbnail-list" v-if="hasMultipleImages">
            <div 
              v-for="img in productStore.currentProduct.images" 
              :key="img.id"
              class="thumbnail"
              :class="{ active: selectedImage === img.image }"
              @click="selectedImage = img.image"
            >
              <img :src="img.image" :alt="productStore.currentProduct.name">
            </div>
          </div>
        </div>

        <div class="product-info">
          <span class="brand-badge">{{ productStore.currentProduct.brand_name || 'Diversos' }}</span>
          <h1 class="product-title">{{ productStore.currentProduct.name }}</h1>
          
          <div class="price-section">
            <span class="current-price">{{ formatPrice(productStore.currentProduct.price) }}</span>
            <span class="payment-conditions">
              em até 12x sem juros ou <strong class="discount-highlight">{{ formatPrice(productStore.currentProduct.price * 0.95) }} no PIX (5% OFF)</strong>
            </span>
          </div>

          <div class="buy-section">
            <div class="quantity-selector">
              <label for="quantity">Quantidade:</label>
              <div class="quantity-controls">
                <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
                <input type="number" id="quantity" v-model.number="quantity" min="1" :max="productStore.currentProduct.stock">
                <button @click="increaseQuantity" :disabled="quantity >= productStore.currentProduct.stock">+</button>
              </div>
            </div>
            <button 
              class="add-to-cart-btn" 
              @click="handleAddToCart"
              :disabled="productStore.currentProduct.stock <= 0"
            >
              {{ productStore.currentProduct.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto Indisponível' }}
            </button>
          </div>

          <div class="stock-info">
            <span v-if="productStore.currentProduct.stock > 0" class="in-stock">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ productStore.currentProduct.stock }} unidades em estoque
            </span>
            <span v-else class="out-of-stock">Sem estoque no momento</span>
          </div>

          <div class="shipping-calculator">
            <h3>Simular Frete e Prazo</h3>
            <div class="shipping-form">
              <input type="text" v-model="zipCode" placeholder="Digite seu CEP" maxlength="9" @keyup.enter="simulateShipping">
              <button class="calculate-btn" @click="simulateShipping" :disabled="isSimulating || !zipCode">
                {{ isSimulating ? 'Calculando...' : 'Calcular' }}
              </button>
            </div>
            
            <div v-if="shippingOptions.length > 0" class="shipping-results">
              <div v-for="(option, index) in shippingOptions" :key="index" class="shipping-option">
                <span class="shipping-company">{{ option.service }}</span>
                <span class="shipping-time">Até {{ option.deadline_days }} dias úteis</span>
                <span class="shipping-price">{{ formatPrice(parseFloat(option.price)) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="productStore.currentProduct" class="technical-details" v-animate>
        <h2>Informações Técnicas</h2>
        <div class="details-content">
          <p>{{ productStore.currentProduct.description }}</p>
          
          <div class="specs-table">
            <div class="spec-row">
              <span class="spec-label">Código SKU:</span>
              <span class="spec-value">{{ productStore.currentProduct.sku }}</span>
            </div>
            <div class="spec-row" v-if="productStore.currentProduct.oem_code">
              <span class="spec-label">Código Original (OEM):</span>
              <span class="spec-value">{{ productStore.currentProduct.oem_code }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Marca:</span>
              <span class="spec-value">{{ productStore.currentProduct.brand_name || 'Diversos' }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Categoria:</span>
              <span class="spec-value">{{ productStore.currentProduct.category_name || 'Geral' }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Peso:</span>
              <span class="spec-value">{{ productStore.currentProduct.weight_kg }} kg</span>
            </div>
          </div>
        </div>

        <template v-if="productStore.currentProduct.compatibilities && productStore.currentProduct.compatibilities.length > 0">
          <h2>Veículos Compatíveis</h2>
          <ul class="compatibility-list">
            <li v-for="(comp, index) in productStore.currentProduct.compatibilities" :key="index">
              {{ comp.maker }} {{ comp.model }} ({{ comp.start_year }} a {{ comp.end_year || 'Atual' }})
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../../stores/productStore'
import { useCartStore } from '../../stores/cartStore'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const quantity = ref(1)
const selectedImage = ref(null)
const zipCode = ref('')
const shippingOptions = ref([])
const isSimulating = ref(false)

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const hasImages = computed(() => {
  return productStore.currentProduct?.images && productStore.currentProduct.images.length > 0
})

const hasMultipleImages = computed(() => {
  return productStore.currentProduct?.images && productStore.currentProduct.images.length > 1
})

const mainImage = computed(() => {
  if (selectedImage.value) return selectedImage.value
  if (hasImages.value) {
    const mainImg = productStore.currentProduct.images.find(img => img.is_main)
    return mainImg ? mainImg.image : productStore.currentProduct.images[0].image
  }
  return null
})

const increaseQuantity = () => {
  if (quantity.value < productStore.currentProduct.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = () => {
  if (!productStore.currentProduct) return
  
  cartStore.addItem({
    id: productStore.currentProduct.id,
    name: productStore.currentProduct.name,
    price: parseFloat(productStore.currentProduct.price),
    brand: productStore.currentProduct.brand_name,
    image: mainImage.value,
    quantity: quantity.value
  })
  
  router.push('/carrinho')
}

const simulateShipping = async () => {
  if (!zipCode.value || zipCode.value.length < 8) return
  
  isSimulating.value = true
  try {
    const response = await api.post('/orders/shipping/simulate/', {
      zip_code: zipCode.value.replace(/\D/g, ''),
      items: [{
        product_id: productStore.currentProduct.id,
        quantity: quantity.value
      }]
    })
    shippingOptions.value = response.data
  } catch (error) {
    console.error('Erro ao simular frete', error)
  } finally {
    isSimulating.value = false
  }
}

onMounted(() => {
  const productId = route.params.slug
  if (productId) {
    productStore.fetchProductById(productId)
  }
})
</script>

<style scoped>
.product-detail-page {
  background-color: var(--bg-color);
  padding: 3rem 0 5rem 0;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  font-weight: 500;
}

.breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: var(--primary-light);
}

.separator {
  margin: 0 0.5rem;
  color: var(--border-color);
}

.current-page {
  color: var(--primary-light);
  font-weight: 600;
}

.feedback-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: var(--text-muted);
  background-color: var(--surface-color);
  border-radius: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.feedback-state.error {
  color: #ef4444;
}

.spinner {
  border: 4px solid rgba(0, 168, 89, 0.2);
  border-left-color: var(--primary-light);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.back-btn {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-light);
  color: #ffffff;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 700;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  margin-bottom: 5rem;
  background-color: var(--surface-color);
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: background-color 0.3s ease;
}

@media (min-width: 992px) {
  .product-layout {
    grid-template-columns: 1fr 1fr;
  }
}

.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-image {
  background-color: var(--surface-hover);
  border-radius: 1rem;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.product-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  color: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder svg {
  width: 5rem;
  height: 5rem;
}

.thumbnail-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.thumbnail {
  background-color: var(--surface-hover);
  border: 2px solid transparent;
  border-radius: 0.5rem;
  height: 80px;
  width: 80px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
}

.thumbnail img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.thumbnail.active, .thumbnail:hover {
  border-color: var(--primary-light);
  background-color: var(--surface-color);
}

.product-info {
  display: flex;
  flex-direction: column;
}

.brand-badge {
  display: inline-block;
  background-color: var(--primary-light-bg);
  color: var(--primary-light);
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.25rem;
  width: fit-content;
}

.product-title {
  font-size: 2.25rem;
  color: var(--primary-dark);
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.price-section {
  margin-bottom: 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.current-price {
  display: block;
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.payment-conditions {
  color: var(--text-muted);
  font-size: 1rem;
}

.discount-highlight {
  color: var(--primary-light);
}

.stock-info {
  margin-bottom: 2.5rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.in-stock {
  color: var(--primary-light);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.in-stock svg {
  width: 1.25rem;
  height: 1.25rem;
}

.out-of-stock {
  color: #ef4444;
}

.buy-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .buy-section {
    flex-direction: row;
    align-items: flex-end;
  }
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quantity-selector label {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: var(--surface-color);
  height: 52px;
}

.quantity-controls button {
  background-color: transparent;
  border: none;
  width: 40px;
  height: 100%;
  font-size: 1.25rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: background-color 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background-color: var(--surface-hover);
  color: var(--text-main);
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 50px;
  height: 100%;
  text-align: center;
  border: none;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-main);
  background-color: transparent;
  outline: none;
}

.quantity-controls input::-webkit-outer-spin-button,
.quantity-controls input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-to-cart-btn {
  flex-grow: 1;
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 0 2rem;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 52px;
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(0, 168, 89, 0.4);
}

.add-to-cart-btn:disabled {
  background-color: var(--border-color);
  color: var(--text-muted);
  box-shadow: none;
  cursor: not-allowed;
}

.shipping-calculator {
  background-color: var(--surface-hover);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.shipping-calculator h3 {
  font-size: 1.125rem;
  color: var(--primary-dark);
  margin: 0 0 1.25rem 0;
  font-weight: 700;
}

.shipping-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.shipping-form input {
  flex-grow: 1;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  background-color: var(--surface-color);
  color: var(--text-main);
  transition: border-color 0.2s ease;
}

.shipping-form input:focus {
  border-color: var(--primary-light);
}

.calculate-btn {
  background-color: var(--primary-dark);
  color: #ffffff;
  border: none;
  padding: 0 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.calculate-btn:hover:not(:disabled) {
  background-color: #00361c;
}

.calculate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.shipping-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shipping-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  font-size: 0.95rem;
}

.shipping-company {
  font-weight: 600;
  color: var(--text-main);
}

.shipping-time {
  color: var(--text-muted);
}

.shipping-price {
  font-weight: 800;
  color: var(--primary-light);
}

.technical-details {
  background-color: var(--surface-color);
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: var(--shadow-md);
}

.technical-details h2 {
  font-size: 1.75rem;
  color: var(--primary-dark);
  margin: 0 0 2rem 0;
  font-weight: 800;
}

.details-content p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 2.5rem;
  font-size: 1.05rem;
}

.specs-table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 3.5rem;
}

.spec-row {
  display: flex;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.spec-row:last-child {
  border-bottom: none;
}

.spec-row:nth-child(even) {
  background-color: var(--surface-hover);
}

.spec-label {
  width: 40%;
  font-weight: 700;
  color: var(--text-main);
}

.spec-value {
  width: 60%;
  color: var(--text-muted);
}

.compatibility-list {
  list-style-type: none;
  padding: 0;
  color: var(--text-muted);
  line-height: 1.8;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.compatibility-list li {
  position: relative;
  padding-left: 1.5rem;
  font-weight: 500;
}

.compatibility-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--primary-light);
  font-weight: bold;
}
</style>