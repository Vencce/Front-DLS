<template>
  <div class="admin-products-page">
    <div class="page-header" v-animate>
      <div>
        <h1 class="page-title">Gerenciamento de Produtos</h1>
        <p class="page-subtitle">Controle seu catálogo, estoque e preços.</p>
      </div>
      <button class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Produto
      </button>
    </div>

    <div class="filters-card" v-animate>
      <div class="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" v-model="filters.search" placeholder="Buscar por nome da peça, código SKU ou OEM...">
      </div>
      <div class="filter-options">
        <div class="input-group">
          <select v-model="filters.category">
            <option value="">Todas as Categorias</option>
            <option value="injecao">Sistemas de Injeção</option>
            <option value="motor">Componentes de Motor</option>
            <option value="filtros">Filtros</option>
            <option value="eletrica">Elétrica</option>
          </select>
        </div>
        <div class="input-group">
          <select v-model="filters.brand">
            <option value="">Todas as Marcas</option>
            <option value="bosch">Bosch</option>
            <option value="delphi">Delphi</option>
            <option value="cummins">Cummins</option>
            <option value="master power">Master Power</option>
          </select>
        </div>
        <div class="input-group">
          <select v-model="filters.stock">
            <option value="">Situação do Estoque</option>
            <option value="in_stock">Em Estoque</option>
            <option value="out_of_stock">Esgotado</option>
          </select>
        </div>
        <button class="btn-clear" @click="clearFilters">Limpar Filtros</button>
      </div>
    </div>

    <div class="table-card" v-animate>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>SKU / OEM</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="5" class="empty-state">
                Nenhum produto encontrado com os filtros selecionados.
              </td>
            </tr>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="product-cell">
                  <div class="img-wrapper">
                    <img v-if="product.images && product.images.length > 0" :src="product.images[0].image" :alt="product.name">
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="product-info">
                    <span class="brand">{{ product.brand_name || 'DLS Auto Peças' }}</span>
                    <span class="name">{{ product.name }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="codes-cell">
                  <span class="sku">{{ product.sku || 'N/A' }}</span>
                  <span class="oem" v-if="product.oem_code">OEM: {{ product.oem_code }}</span>
                </div>
              </td>
              <td class="price-cell">{{ formatPrice(product.price) }}</td>
              <td>
                <span class="status-badge" :class="product.stock > 0 ? 'status-active' : 'status-danger'">
                  {{ product.stock }} un
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon edit" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button class="btn-icon delete" title="Excluir">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../../stores/productStore'

const productStore = useProductStore()

const filters = ref({
  search: '',
  category: '',
  brand: '',
  stock: ''
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    brand: '',
    stock: ''
  }
}

const filteredProducts = computed(() => {
  let result = productStore.products

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.sku && p.sku.toLowerCase().includes(q)) || 
      (p.oem_code && p.oem_code.toLowerCase().includes(q))
    )
  }

  if (filters.value.category) {
    const cat = filters.value.category.toLowerCase()
    result = result.filter(p => 
      (p.category_name && p.category_name.toLowerCase().includes(cat)) || 
      String(p.category) === cat
    )
  }

  if (filters.value.brand) {
    const br = filters.value.brand.toLowerCase()
    result = result.filter(p => p.brand_name && p.brand_name.toLowerCase().includes(br))
  }

  if (filters.value.stock === 'in_stock') {
    result = result.filter(p => p.stock > 0)
  } else if (filters.value.stock === 'out_of_stock') {
    result = result.filter(p => p.stock <= 0)
  }

  return result
})

onMounted(() => {
  productStore.fetchProducts({ page: 1 })
})
</script>

<style scoped>
.admin-products-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.page-title {
  font-size: 2rem;
  color: var(--text-main);
  margin: 0 0 0.25rem 0;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: var(--text-muted);
  margin: 0;
  font-weight: 500;
}

.btn-primary {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.btn-primary svg {
  width: 1.25rem;
  height: 1.25rem;
}

.filters-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-bar svg {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
}

.search-bar input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-bar input:focus {
  border-color: var(--primary-light);
}

.filter-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .filter-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .filter-options {
    grid-template-columns: repeat(4, 1fr);
  }
}

.input-group select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
}

.btn-clear {
  background-color: var(--surface-hover);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  background-color: var(--border-color);
}

.table-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 800px;
}

.data-table th {
  background-color: var(--surface-hover);
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
}

.data-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.data-table tr:hover td {
  background-color: var(--surface-hover);
}

.data-table tr:last-child td {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  padding: 3rem !important;
  color: var(--text-muted);
  font-weight: 600;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.img-wrapper {
  width: 48px;
  height: 48px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.25rem;
}

.img-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.img-wrapper svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--border-color);
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-info .brand {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.product-info .name {
  font-size: 0.95rem;
  color: var(--text-main);
  font-weight: 700;
}

.codes-cell {
  display: flex;
  flex-direction: column;
}

.codes-cell .sku {
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.9rem;
}

.codes-cell .oem {
  font-size: 0.75rem;
  color: var(--text-muted);
  background-color: var(--surface-hover);
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  display: inline-block;
  margin-top: 0.25rem;
  width: fit-content;
}

.price-cell {
  font-weight: 800;
  color: var(--primary-dark);
  font-size: 1.05rem;
}

.status-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
  white-space: nowrap;
}

.status-active {
  background-color: rgba(0, 168, 89, 0.15);
  color: var(--primary-light);
}

.status-danger {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-muted);
}

.btn-icon.edit:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.btn-icon.delete:hover {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.btn-icon svg {
  width: 1.1rem;
  height: 1.1rem;
}
</style>