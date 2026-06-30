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
}

const filteredProducts = computed(() => {
  let result = productStore.products

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

  return result
})

onMounted(async () => {
  await productStore.fetchCategories()
  await productStore.fetchBrands()
  await productStore.fetchProducts()
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
      <aside class="filters-sidebar">
        <div class="filter-group">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" v-model="filters.search" placeholder="Buscar por Nome, SKU ou OEM...">
          </div>
        </div>

        <div class="filter-group">
          <button class="filter-toggle" @click="isCategoryOpen = !isCategoryOpen">
            <h3>Categorias</h3>
            <svg :class="{ 'rotate-180': isCategoryOpen }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div class="filter-content" v-show="isCategoryOpen">
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

        <div class="filter-group">
          <button class="filter-toggle" @click="isBrandOpen = !isBrandOpen">
            <h3>Marcas</h3>
            <svg :class="{ 'rotate-180': isBrandOpen }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div class="filter-content" v-show="isBrandOpen">
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

        <button class="btn-clear" @click="clearFilters" v-if="filters.search || filters.category || filters.brand">
          Limpar Filtros
        </button>
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

.filters-sidebar {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  padding: 0 0 1rem 0;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.filter-toggle h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.filter-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.search-box {
  position: relative;
  margin-bottom: 0.5rem;
}

.search-box input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-box input:focus {
  border-color: var(--primary-light);
}

.search-box svg {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
}

.filter-content {
  padding-top: 0.5rem;
}

.scrollable-list {
  max-height: 250px;
  overflow-y: auto;
  scrollbar-width: thin;
  padding-right: 0.5rem;
}

.scrollable-list::-webkit-scrollbar {
  width: 4px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: var(--bg-color);
  border-radius: 4px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
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
  color: var(--text-main);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-list button:hover {
  background-color: var(--surface-hover);
  color: var(--primary-light);
}

.filter-list button.active {
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
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
  margin-top: 1rem;
}

.btn-clear:hover {
  background-color: #ef4444;
  color: #ffffff;
}

.btn-clear-large {
  background-color: var(--primary-light);
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
  background-color: var(--surface-color);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-light);
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
  color: var(--border-color);
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  color: var(--text-main);
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-light);
}

.card-image {
  aspect-ratio: 4/3;
  width: 100%;
  background-color: var(--surface-hover);
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
  color: var(--border-color);
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
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
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
  color: var(--primary-light);
}

.product-codes {
  font-size: 0.8rem;
  color: var(--text-muted);
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
  color: var(--primary-dark);
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
  background-color: var(--primary-light);
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
  background-color: var(--primary-hover);
}

.btn-add-cart:disabled {
  background-color: var(--surface-hover);
  color: var(--text-muted);
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