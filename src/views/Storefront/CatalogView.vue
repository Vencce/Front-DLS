<template>
  <div class="catalog-page">
    <div class="page-header" v-animate>
      <div class="container">
        <h1>Catálogo de Peças</h1>
        <p>Encontre as peças ideais para o seu veículo Diesel</p>
      </div>
    </div>

    <div class="container catalog-layout">
      <aside class="filters-sidebar" v-animate>
        <div class="filter-group">
          <h3>Buscar</h3>
          <div class="search-box">
            <input type="text" v-model="searchQuery" @keyup.enter="applyFilters" placeholder="Nome ou SKU...">
            <button @click="applyFilters" class="search-btn">Ir</button>
          </div>
        </div>

        <div class="filter-group">
          <h3>Categorias</h3>
          <div class="filter-options">
            <label class="checkbox-label">
              <input type="checkbox" value="injecao">
              <span class="custom-checkbox"></span>
              Sistemas de Injeção
            </label>
            <label class="checkbox-label">
              <input type="checkbox" value="motor">
              <span class="custom-checkbox"></span>
              Motor e Componentes
            </label>
            <label class="checkbox-label">
              <input type="checkbox" value="filtros">
              <span class="custom-checkbox"></span>
              Filtros
            </label>
          </div>
        </div>
      </aside>

      <main class="products-area" v-animate>
        <div class="products-header">
          <span>Mostrando {{ productStore.products.length }} de {{ productStore.totalItems }} produtos</span>
          <div class="sort-options">
            <label for="sort">Ordenar por:</label>
            <select id="sort">
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>
        </div>

        <div v-if="productStore.loading" class="feedback-state">
          <div class="spinner"></div>
          <p>Carregando catálogo...</p>
        </div>

        <div v-else-if="productStore.error" class="feedback-state error">
          <p>{{ productStore.error }}</p>
          <button @click="applyFilters" class="retry-btn">Tentar Novamente</button>
        </div>

        <div v-else-if="productStore.products.length === 0" class="feedback-state">
          <p>Nenhum produto encontrado para esta busca.</p>
          <button @click="clearFilters" class="retry-btn">Limpar Filtros</button>
        </div>

        <div v-else class="product-grid">
          <div class="product-card" v-for="product in productStore.products" :key="product.id">
            <div class="product-image">
              <img v-if="product.images && product.images.length > 0" :src="product.images[0].image" :alt="product.name" class="catalog-img">
              <div v-else class="image-placeholder">Sem Imagem</div>
            </div>
            <div class="product-info">
              <span class="product-brand">{{ product.brand_name || 'Sem Marca' }}</span>
              <h3 class="product-title">{{ product.name }}</h3>
              <p class="product-compatibility">SKU: {{ product.sku }}</p>
              <div class="product-price-row">
                <span class="product-price">{{ formatPrice(product.price) }}</span>
              </div>
              <router-link :to="`/produto/${product.id}`" class="add-to-cart-btn">Ver Detalhes</router-link>
            </div>
          </div>
        </div>
        
        <div class="pagination" v-if="productStore.totalPages > 1">
          <button 
            :disabled="productStore.currentPage === 1" 
            @click="changePage(productStore.currentPage - 1)"
            class="page-btn">
            Anterior
          </button>
          <span class="page-info">Página {{ productStore.currentPage }} de {{ productStore.totalPages }}</span>
          <button 
            :disabled="productStore.currentPage === productStore.totalPages" 
            @click="changePage(productStore.currentPage + 1)"
            class="page-btn">
            Próxima
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '../../stores/productStore'

const productStore = useProductStore()
const searchQuery = ref('')

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const applyFilters = () => {
  productStore.currentPage = 1
  productStore.fetchProducts({
    search: searchQuery.value,
    page: productStore.currentPage
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  applyFilters()
}

const changePage = (newPage) => {
  productStore.currentPage = newPage
  productStore.fetchProducts({
    search: searchQuery.value,
    page: productStore.currentPage
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<style scoped>
.catalog-page {
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  background-color: var(--primary-light-bg);
  padding: 4rem 0;
  margin-bottom: 3rem;
  transition: background-color 0.3s ease;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--primary-dark);
  margin: 0 0 0.5rem 0;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.page-header p {
  margin: 0;
  color: var(--primary-light);
  font-size: 1.125rem;
  font-weight: 500;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.catalog-layout {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 5rem;
}

@media (min-width: 768px) {
  .catalog-layout {
    flex-direction: row;
  }
}

.filters-sidebar {
  width: 100%;
  background-color: var(--surface-color);
  border: none;
  border-radius: 1rem;
  padding: 2rem;
  height: fit-content;
  box-shadow: var(--shadow-md);
  transition: background-color 0.3s ease;
}

@media (min-width: 768px) {
  .filters-sidebar {
    width: 280px;
    flex-shrink: 0;
  }
}

.filter-group {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.filter-group:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.filter-group h3 {
  font-size: 1.125rem;
  color: var(--primary-dark);
  margin: 0 0 1.25rem 0;
  font-weight: 700;
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-box input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  outline: none;
  background-color: var(--surface-color);
  color: var(--text-main);
}

.search-box input:focus {
  border-color: var(--primary-light);
}

.search-btn {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 0 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--text-muted);
  user-select: none;
  transition: color 0.2s ease;
}

.checkbox-label:hover {
  color: var(--text-main);
}

.checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.custom-checkbox {
  height: 1.25rem;
  width: 1.25rem;
  background-color: var(--surface-color);
  border: 2px solid var(--border-color);
  border-radius: 0.375rem;
  margin-right: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-label:hover input ~ .custom-checkbox {
  border-color: var(--primary-light);
}

.checkbox-label input:checked ~ .custom-checkbox {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
}

.custom-checkbox:after {
  content: "";
  display: none;
  width: 5px;
  height: 10px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label input:checked ~ .custom-checkbox:after {
  display: block;
}

.products-area {
  flex-grow: 1;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 1.5rem 0;
  margin-bottom: 1.5rem;
}

.products-header span {
  color: var(--text-muted);
  font-weight: 500;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-options label {
  color: var(--text-muted);
  font-weight: 500;
}

.sort-options select {
  padding: 0.625rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--surface-color);
  color: var(--text-main);
  outline: none;
  font-weight: 500;
  cursor: pointer;
}

.sort-options select:focus {
  border-color: var(--primary-light);
}

.feedback-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: var(--text-muted);
  background-color: var(--surface-color);
  border-radius: 1rem;
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

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background-color: var(--surface-color);
  border: none;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.product-image {
  height: 220px;
  background-color: var(--surface-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1rem;
}

.catalog-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-placeholder {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-brand {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.product-title {
  font-size: 1.125rem;
  color: var(--primary-dark);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  font-weight: 700;
  flex-grow: 1;
}

.product-compatibility {
  font-size: 0.85rem;
  color: var(--primary-light);
  margin: 0 0 1.25rem 0;
  font-weight: 500;
}

.product-price-row {
  margin-bottom: 1.25rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
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
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.product-card:hover .add-to-cart-btn {
  background-color: var(--primary-light);
  color: #ffffff;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.page-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-main);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--primary-light);
  color: #ffffff;
  border-color: var(--primary-light);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: var(--text-muted);
}
</style>