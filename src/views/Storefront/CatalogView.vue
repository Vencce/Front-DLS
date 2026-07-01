<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../../stores/productStore'
import { useCartStore } from '../../stores/cartStore'

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const filters = ref({
  search: '',
  category: '',
  brand: ''
})

const sortOption = ref('')
const minPrice = ref(0.00)
const maxPrice = ref(1000.00)
const absMin = ref(0.00)
const absMax = ref(1000.00)

const isCategoryOpen = ref(true)
const isBrandOpen = ref(true)

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const resolveImage = (imgPath) => {
  if (!imgPath) return ''
  return imgPath.startsWith('http') ? imgPath : `https://dls-auto-pecas-api.onrender.com${imgPath}`
}

const getImg = (product) => {
  if (product.images && product.images.length > 0) {
    const mainImg = product.images.find(i => i.is_main) || product.images[0]
    return resolveImage(mainImg.image)
  }
  return null
}

const handleAddToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    brand: product.brand_name || 'DLS Auto Peças',
    image: getImg(product),
    quantity: 1
  })
}

const clearFilters = () => {
  filters.value.search = ''
  filters.value.category = ''
  filters.value.brand = ''
  sortOption.value = ''
  minPrice.value = absMin.value
  maxPrice.value = absMax.value
}

const validateMin = () => {
  if (Number(minPrice.value) > Number(maxPrice.value)) {
    minPrice.value = maxPrice.value
  }
}

const validateMax = () => {
  if (Number(maxPrice.value) < Number(minPrice.value)) {
    maxPrice.value = minPrice.value
  }
}

const filteredProducts = computed(() => {
  let result = [...productStore.products]

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) || 
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.oem_code && p.oem_code.toLowerCase().includes(q))
    )
  }

  if (filters.value.category) {
    const cat = productStore.categories.find(c => c.id === filters.value.category)
    if (cat) {
      result = result.filter(p => p.category_name && p.category_name.includes(cat.name))
    }
  }

  if (filters.value.brand) {
    const brand = productStore.brands.find(b => b.id === filters.value.brand)
    if (brand) {
      result = result.filter(p => p.brand_name && p.brand_name.includes(brand.name))
    }
  }

  result = result.filter(p => {
    const price = parseFloat(p.price)
    return price >= Number(minPrice.value) && price <= Number(maxPrice.value)
  })

  if (sortOption.value === 'price_asc') {
    result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
  } else if (sortOption.value === 'price_desc') {
    result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
  } else if (sortOption.value === 'name_asc') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  } else if (sortOption.value === 'name_desc') {
    result.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
  }

  return result
})

onMounted(async () => {
  await productStore.fetchCategories()
  await productStore.fetchBrands()
  await productStore.fetchProducts()
  
  if (productStore.products.length > 0) {
    const maxP = Math.max(...productStore.products.map(p => parseFloat(p.price)))
    absMax.value = Math.ceil(maxP)
    maxPrice.value = absMax.value
  }
})
</script>

<template>
  <div class="catalog-page">
    <div class="catalog-header">
      <div class="container">
        <h1>Catálogo de Peças</h1>
        <p>Encontre as melhores peças originais e de reposição para o seu veículo</p>
      </div>
    </div>

    <div class="container layout-grid">
      <aside class="filter-sidebar">
        
        <div class="filter-section search-section">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" v-model="filters.search" placeholder="Buscar peça...">
          </div>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Ordenar por:</h3>
          <div class="sort-grid">
            <button class="sort-btn" :class="{ active: sortOption === 'best_sellers' }" @click="sortOption = 'best_sellers'">
              <div class="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              </div>
              <span>Mais vendidos</span>
            </button>
            
            <button class="sort-btn" :class="{ active: sortOption === 'discount' }" @click="sortOption = 'discount'">
              <div class="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="5" x2="5" y2="19"></line>
                  <circle cx="6.5" cy="6.5" r="2.5"></circle>
                  <circle cx="17.5" cy="17.5" r="2.5"></circle>
                </svg>
              </div>
              <span>Desconto</span>
            </button>
            
            <button class="sort-btn" :class="{ active: sortOption === 'price_asc' }" @click="sortOption = 'price_asc'">
              <div class="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </div>
              <span>Menor Preço</span>
            </button>
            
            <button class="sort-btn" :class="{ active: sortOption === 'price_desc' }" @click="sortOption = 'price_desc'">
              <div class="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </div>
              <span>Maior Preço</span>
            </button>
            
            <button class="sort-btn" :class="{ active: sortOption === 'name_asc' }" @click="sortOption = 'name_asc'">
              <div class="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 3h5v5"></path>
                  <path d="M21 3l-7 7"></path>
                  <path d="M8 21H3v-5"></path>
                  <path d="M3 21l7-7"></path>
                </svg>
              </div>
              <span>Nome (A-Z)</span>
            </button>
            
            <button class="sort-btn" :class="{ active: sortOption === 'name_desc' }" @click="sortOption = 'name_desc'">
              <div class="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 3H3v5"></path>
                  <path d="M3 3l7 7"></path>
                  <path d="M16 21h5v-5"></path>
                  <path d="M21 21l-7-7"></path>
                </svg>
              </div>
              <span>Nome (Z-A)</span>
            </button>
          </div>
        </div>

        <div class="accordion-group">
          <div class="accordion-item">
            <button class="accordion-header" @click="isCategoryOpen = !isCategoryOpen">
              <span>Categorias</span>
              <svg :class="{'rotate': isCategoryOpen}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="accordion-body" v-show="isCategoryOpen">
              <ul class="filter-list scrollable-list">
                <li>
                  <button :class="{ active: filters.category === '' }" @click="filters.category = ''">
                    Todas as Categorias
                  </button>
                </li>
                <li v-for="cat in productStore.categories" :key="cat.id">
                  <button :class="{ active: filters.category === cat.id }" @click="filters.category = cat.id">
                    {{ cat.name }}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-header" @click="isBrandOpen = !isBrandOpen">
              <span>Marcas</span>
              <svg :class="{'rotate': isBrandOpen}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="accordion-body" v-show="isBrandOpen">
              <ul class="filter-list scrollable-list">
                <li>
                  <button :class="{ active: filters.brand === '' }" @click="filters.brand = ''">
                    Todas as Marcas
                  </button>
                </li>
                <li v-for="brand in productStore.brands" :key="brand.id">
                  <button :class="{ active: filters.brand === brand.id }" @click="filters.brand = brand.id">
                    {{ brand.name }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="filter-section price-section">
          <h3 class="filter-title price-title">Faixas de preço</h3>
          <div class="price-inputs">
            <input type="number" v-model="minPrice" class="price-input" step="0.01">
            <input type="number" v-model="maxPrice" class="price-input" step="0.01">
            <button class="price-ok-btn" @click="validateMin(); validateMax()">OK</button>
          </div>
          
          <div class="price-slider-container">
            <input type="range" :min="absMin" :max="absMax" v-model="minPrice" class="slider" @input="validateMin">
            <input type="range" :min="absMin" :max="absMax" v-model="maxPrice" class="slider" @input="validateMax">
          </div>
          
          <div class="price-labels">
            <div class="price-label">
              <span>R$ {{ Number(minPrice).toFixed(2).replace('.', ',') }}</span>
              <span class="sub-label">(min)</span>
            </div>
            <div class="price-label right">
              <span>R$ {{ Number(maxPrice).toFixed(2).replace('.', ',') }}</span>
              <span class="sub-label">(máx)</span>
            </div>
          </div>
        </div>
        
        <div class="filter-section clear-section" v-if="filters.search || filters.category || filters.brand || sortOption || minPrice > absMin || maxPrice < absMax">
          <button class="btn-clear" @click="clearFilters">
            Limpar Filtros
          </button>
        </div>
      </aside>

      <main class="products-area">
        <div v-if="productStore.loading" class="loading-state">
          <div class="spinner"></div>
          <p>Buscando estoque...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2>Nenhuma peça encontrada</h2>
          <p>Tente ajustar ou remover alguns filtros para ver mais resultados.</p>
          <button class="btn-clear-large" @click="clearFilters">Remover Filtros</button>
        </div>

        <div v-else class="products-grid">
          <div class="product-card" v-for="product in filteredProducts" :key="product.id">
            <div class="card-image" @click="router.push(`/produto/${product.id}`)">
              <img v-if="getImg(product)" :src="getImg(product)" :alt="product.name">
              <div v-else class="img-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div class="card-content">
              <span class="product-brand">{{ product.brand_name || 'DLS Auto Peças' }}</span>
              <h3 class="product-name" @click="router.push(`/produto/${product.id}`)">{{ product.name }}</h3>
              
              <div class="product-codes">
                <span v-if="product.sku">SKU: {{ product.sku }}</span>
              </div>

              <div class="product-price">
                <span class="price-value">{{ formatPrice(product.price) }}</span>
                <span class="stock-status" :class="{ 'out-of-stock': product.stock <= 0 }">
                  {{ product.stock > 0 ? 'Em Estoque' : 'Esgotado' }}
                </span>
              </div>

              <button class="btn-add-cart" @click="handleAddToCart(product)" :disabled="product.stock <= 0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ product.stock > 0 ? 'Comprar' : 'Sem Estoque' }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.catalog-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding-bottom: 5rem;
}

.catalog-header {
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  padding: 3rem 0;
  margin-bottom: 2.5rem;
  text-align: center;
}

.catalog-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.catalog-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin: 0;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 992px) {
  .layout-grid {
    grid-template-columns: 280px 1fr;
  }
}

.filter-sidebar {
  background-color: var(--surface-color, #ffffff);
  border: 1px solid var(--border-color, #b3b3b3);
  border-radius: 12px;
  overflow: hidden;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: sticky;
  top: 2rem;
}

.filter-section {
  padding: 20px;
}

.search-section {
  padding-bottom: 0;
}

.search-box {
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.5rem;
  border: 1px solid var(--border-color, #b3b3b3);
  border-radius: 0.5rem;
  background-color: var(--bg-color, #ffffff);
  color: var(--text-main, #333333);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-box input:focus {
  border-color: var(--primary-light, #008a3c);
}

.search-box svg {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted, #666666);
}

.filter-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--primary-dark, #1a4b76);
  margin: 0 0 15px 0;
}

.price-title {
  color: var(--text-main, #333333);
}

.sort-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px 5px;
}

.sort-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s;
}

.sort-btn:hover {
  transform: scale(1.05);
}

.icon-circle {
  width: 45px;
  height: 45px;
  border: 1.5px solid var(--text-main, #333333);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: var(--text-main, #333333);
  transition: all 0.2s;
}

.icon-circle svg {
  width: 22px;
  height: 22px;
}

.sort-btn span {
  font-size: 11px;
  color: var(--text-main, #333333);
  text-align: center;
  line-height: 1.2;
  transition: all 0.2s;
}

.sort-btn.active .icon-circle {
  border-color: var(--primary-light, #008a3c);
  color: var(--primary-light, #008a3c);
  background-color: rgba(0, 138, 60, 0.05);
}

.sort-btn.active span {
  color: var(--primary-light, #008a3c);
  font-weight: bold;
}

.accordion-group {
  border-top: 1px solid var(--border-color, #b3b3b3);
  border-bottom: 1px solid var(--border-color, #b3b3b3);
}

.accordion-item {
  border-bottom: 1px solid var(--border-color, #b3b3b3);
}

.accordion-item:last-child {
  border-bottom: none;
}

.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  color: var(--text-main, #333333);
}

.accordion-header svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.accordion-header svg.rotate {
  transform: rotate(180deg);
}

.accordion-body {
  padding: 0 10px 15px 10px;
}

.scrollable-list {
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  padding-right: 0.5rem;
}

.scrollable-list::-webkit-scrollbar {
  width: 4px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: var(--bg-color, #f9f9f9);
  border-radius: 4px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: var(--border-color, #b3b3b3);
  border-radius: 4px;
}

.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-list button {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.65rem 1rem;
  border-radius: 0.5rem;
  color: var(--text-main, #333333);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-list button:hover {
  background-color: var(--surface-hover, #f1f1f1);
  color: var(--primary-light, #008a3c);
}

.filter-list button.active {
  background-color: rgba(0, 138, 60, 0.1);
  color: var(--primary-dark, #006b2e);
}

.price-section {
  padding: 20px;
}

.price-inputs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.price-input {
  width: 75px;
  height: 30px;
  border: 1px solid var(--primary-light, #008a3c);
  border-radius: 4px;
  padding: 0 5px;
  font-size: 13px;
  color: var(--text-main, #333333);
  background-color: var(--bg-color, #ffffff);
  outline: none;
  text-align: center;
}

.price-ok-btn {
  background-color: var(--primary-light, #008a3c);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  height: 30px;
  padding: 0 15px;
  font-weight: bold;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.price-ok-btn:hover {
  background-color: var(--primary-dark, #006b2e);
}

.price-slider-container {
  position: relative;
  height: 20px;
  margin-bottom: 10px;
}

.slider {
  position: absolute;
  width: 100%;
  pointer-events: none;
  appearance: none;
  z-index: 2;
  height: 3px;
  background: var(--primary-light, #008a3c);
  top: 8px;
  border-radius: 5px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  pointer-events: all;
  width: 14px;
  height: 14px;
  appearance: none;
  border-radius: 50%;
  background: var(--primary-light, #008a3c);
  cursor: pointer;
}

.price-labels {
  display: flex;
  justify-content: space-between;
}

.price-label {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: var(--text-muted, #666666);
}

.price-label.right {
  align-items: flex-end;
}

.sub-label {
  font-size: 11px;
}

.clear-section {
  padding-top: 0;
  text-align: center;
}

.btn-clear {
  background-color: transparent;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.btn-clear:hover {
  background-color: #ef4444;
  color: #ffffff;
}

.btn-clear-large {
  background-color: var(--primary-light, #008a3c);
  color: #ffffff;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
  background-color: var(--surface-color, #ffffff);
  border-radius: 1rem;
  border: 1px solid var(--border-color, #b3b3b3);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color, #b3b3b3);
  border-top-color: var(--primary-light, #008a3c);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state svg {
  width: 5rem;
  height: 5rem;
  color: var(--border-color, #b3b3b3);
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  color: var(--text-main, #333333);
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-muted, #666666);
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: var(--surface-color, #ffffff);
  border: 1px solid var(--border-color, #b3b3b3);
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-light, #008a3c);
}

.card-image {
  aspect-ratio: 4/3;
  width: 100%;
  background-color: var(--surface-hover, #f9f9f9);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.card-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .card-image img {
  transform: scale(1.05);
}

.img-placeholder {
  color: var(--border-color, #b3b3b3);
}

.img-placeholder svg {
  width: 3rem;
  height: 3rem;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-brand {
  font-size: 0.75rem;
  color: var(--text-muted, #666666);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main, #333333);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-name:hover {
  color: var(--primary-light, #008a3c);
}

.product-codes {
  font-size: 0.8rem;
  color: var(--text-muted, #666666);
  margin-bottom: 1rem;
}

.product-price {
  margin-top: auto;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-dark, #006b2e);
}

.stock-status {
  font-size: 0.8rem;
  font-weight: 700;
  color: #059669;
}

.stock-status.out-of-stock {
  color: #dc2626;
}

.btn-add-cart {
  width: 100%;
  background-color: var(--primary-light, #008a3c);
  color: #ffffff;
  border: none;
  padding: 0.85rem;
  border-radius: 0.5rem;
  font-weight: 800;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-cart:hover:not(:disabled) {
  background-color: var(--primary-hover, #007a35);
}

.btn-add-cart:disabled {
  background-color: var(--surface-hover, #f1f1f1);
  color: var(--text-muted, #666666);
  cursor: not-allowed;
}

.btn-add-cart svg {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 768px) {
  .catalog-header {
    padding: 2rem 0;
  }

  .catalog-header h1 {
    font-size: 1.75rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .card-content {
    padding: 1rem;
  }

  .product-name {
    font-size: 1rem;
  }

  .price-value {
    font-size: 1.25rem;
  }
}
</style>