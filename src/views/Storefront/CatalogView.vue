<template>
  <div class="catalog-page">
    <div class="container catalog-layout">
      <div class="mobile-filter-bar">
        <button class="filter-toggle" @click="toggleFilters">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filtros
        </button>
        <span class="results-count">{{ productStore.products.length }} produtos encontrados</span>
      </div>

      <aside class="catalog-sidebar" :class="{ 'is-open': showFilters }">
        <div class="sidebar-header-mobile">
          <h3>Filtros</h3>
          <button class="close-filters" @click="toggleFilters">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="filter-group">
          <h3 class="filter-title">Categorias</h3>
          <ul class="filter-list">
            <li>
              <label class="custom-checkbox">
                <input type="checkbox" value="injecao" v-model="selectedCategories" @change="applyFilters">
                <span class="checkmark"></span>
                Injeção
              </label>
            </li>
            <li>
              <label class="custom-checkbox">
                <input type="checkbox" value="motor" v-model="selectedCategories" @change="applyFilters">
                <span class="checkmark"></span>
                Motor
              </label>
            </li>
            <li>
              <label class="custom-checkbox">
                <input type="checkbox" value="filtros" v-model="selectedCategories" @change="applyFilters">
                <span class="checkmark"></span>
                Filtros
              </label>
            </li>
            <li>
              <label class="custom-checkbox">
                <input type="checkbox" value="eletrica" v-model="selectedCategories" @change="applyFilters">
                <span class="checkmark"></span>
                Elétrica
              </label>
            </li>
          </ul>
        </div>

        <div class="filter-group">
          <h3 class="filter-title">Marcas</h3>
          <ul class="filter-list">
            <li>
              <label class="custom-checkbox">
                <input type="checkbox" value="bosch" v-model="selectedBrands" @change="applyFilters">
                <span class="checkmark"></span>
                Bosch
              </label>
            </li>
            <li>
              <label class="custom-checkbox">
                <input type="checkbox" value="delphi" v-model="selectedBrands" @change="applyFilters">
                <span class="checkmark"></span>
                Delphi
              </label>
            </li>
            <li>
              <label class="custom-checkbox">
                <input type="checkbox" value="cummins" v-model="selectedBrands" @change="applyFilters">
                <span class="checkmark"></span>
                Cummins
              </label>
            </li>
          </ul>
        </div>
      </aside>

      <div class="catalog-content">
        <div class="catalog-header">
          <h1 class="catalog-title">Catálogo de Peças</h1>
          <div class="sort-control">
            <label for="sort">Ordenar por:</label>
            <select id="sort" v-model="sortBy" @change="applyFilters">
              <option value="relevance">Relevância</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="name_asc">Nome A-Z</option>
            </select>
          </div>
        </div>

        <div v-if="productStore.loading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando catálogo...</p>
        </div>

        <div v-else-if="productStore.products.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2>Nenhum produto encontrado</h2>
          <p>Tente ajustar os filtros ou buscar por outro termo.</p>
          <button class="btn-clear" @click="clearFilters">Limpar Filtros</button>
        </div>

        <div v-else class="product-grid">
          <div class="product-card" v-for="product in productStore.products" :key="product.id">
            <div class="product-image" @click="goToProduct(product.id)">
              <img v-if="product.images && product.images.length > 0" :src="product.images[0].image" :alt="product.name">
              <div v-else class="image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="product-info">
              <span class="product-brand">{{ product.brand_name || 'DLS Auto Peças' }}</span>
              <h3 class="product-title" @click="goToProduct(product.id)">{{ product.name }}</h3>
              <div class="product-price-row">
                <span class="product-price">{{ formatPrice(product.price) }}</span>
              </div>
              <button @click="addToCart(product)" class="add-to-cart-btn">Adicionar ao Carrinho</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar-backdrop" :class="{ 'is-active': showFilters }" @click="toggleFilters"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '../../stores/productStore'
import { useCartStore } from '../../stores/cartStore'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const showFilters = ref(false)
const selectedCategories = ref([])
const selectedBrands = ref([])
const sortBy = ref('relevance')

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const goToProduct = (id) => {
  router.push(`/produto/${id}`)
}

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    brand: product.brand_name,
    image: product.images && product.images.length > 0 ? product.images[0].image : null,
    quantity: 1
  })
}

const applyFilters = () => {
  const query = { ...route.query }
  if (selectedCategories.value.length) query.category = selectedCategories.value.join(',')
  else delete query.category
  
  if (selectedBrands.value.length) query.brand = selectedBrands.value.join(',')
  else delete query.brand
  
  if (sortBy.value !== 'relevance') query.sort = sortBy.value
  else delete query.sort

  router.push({ query })
  productStore.fetchProducts(query)
}

const clearFilters = () => {
  selectedCategories.value = []
  selectedBrands.value = []
  sortBy.value = 'relevance'
  router.push({ query: {} })
  productStore.fetchProducts({})
}

watch(() => route.query, (newQuery) => {
  if (newQuery.category) selectedCategories.value = newQuery.category.split(',')
  if (newQuery.brand) selectedBrands.value = newQuery.brand.split(',')
  if (newQuery.sort) sortBy.value = newQuery.sort
  productStore.fetchProducts(newQuery)
}, { deep: true })

onMounted(() => {
  const query = route.query
  if (query.category) selectedCategories.value = query.category.split(',')
  if (query.brand) selectedBrands.value = query.brand.split(',')
  if (query.sort) sortBy.value = query.sort
  productStore.fetchProducts(query)
})
</script>

<style scoped>
.catalog-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding: 2rem 0 5rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
}

.catalog-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
}

@media (min-width: 992px) {
  .catalog-layout {
    flex-direction: row;
    align-items: flex-start;
  }
}

.mobile-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--surface-color);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
}

@media (min-width: 992px) {
  .mobile-filter-bar {
    display: none;
  }
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--primary-dark);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}

.filter-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
}

.results-count {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

.catalog-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: var(--surface-color);
  z-index: 100;
  padding: 1.5rem;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.catalog-sidebar.is-open {
  transform: translateX(0);
}

@media (min-width: 992px) {
  .catalog-sidebar {
    position: sticky;
    top: 2rem;
    transform: none;
    height: auto;
    max-height: calc(100vh - 4rem);
    width: 260px;
    flex-shrink: 0;
    box-shadow: none;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
  }
}

.sidebar-header-mobile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: -1rem;
}

@media (min-width: 992px) {
  .sidebar-header-mobile {
    display: none;
  }
}

.sidebar-header-mobile h3 {
  font-size: 1.25rem;
  color: var(--primary-dark);
  margin: 0;
}

.close-filters {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
}

.close-filters svg {
  width: 1.5rem;
  height: 1.5rem;
}

.filter-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 2rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--text-main);
  user-select: none;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1.25rem;
  width: 1.25rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.custom-checkbox:hover input ~ .checkmark {
  border-color: var(--primary-light);
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.catalog-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.catalog-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .catalog-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.catalog-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-control label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
}

.sort-control select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--surface-color);
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}

.sort-control select:focus {
  border-color: var(--primary-light);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: var(--text-muted);
}

.spinner {
  border: 3px solid rgba(0, 168, 89, 0.2);
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  text-align: center;
  background-color: var(--surface-color);
  border-radius: 1rem;
  border: 1px dashed var(--border-color);
}

.empty-state svg {
  width: 4rem;
  height: 4rem;
  color: var(--border-color);
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-muted);
  margin: 0 0 1.5rem 0;
}

.btn-clear {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-clear:hover {
  background-color: var(--primary-hover);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.product-image {
  height: 220px;
  background-color: var(--surface-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1.5rem;
  cursor: pointer;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.image-placeholder {
  color: var(--border-color);
}

.image-placeholder svg {
  width: 3rem;
  height: 3rem;
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-brand {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  font-weight: 800;
}

.product-title {
  font-size: 1.05rem;
  color: var(--text-main);
  margin: 0 0 1rem 0;
  line-height: 1.4;
  font-weight: 700;
  flex-grow: 1;
  cursor: pointer;
}

.product-title:hover {
  color: var(--primary-light);
}

.product-price-row {
  margin-bottom: 1.25rem;
}

.product-price {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--primary-dark);
}

.add-to-cart-btn {
  width: 100%;
  background-color: var(--surface-hover);
  color: var(--primary-dark);
  border: none;
  padding: 0.875rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover .add-to-cart-btn {
  background-color: var(--primary-light);
  color: #ffffff;
}

.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  z-index: 90;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-backdrop.is-active {
  opacity: 1;
  visibility: visible;
}

@media (min-width: 992px) {
  .sidebar-backdrop {
    display: none;
  }
}
</style>