<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'

const products = ref([])
const categories = ref([])
const brands = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showModal = ref(false)
const isEditing = ref(false)

const filters = ref({
  search: '',
  category: '',
  brand: '',
  stock: ''
})

const formData = ref({
  id: null,
  name: '',
  sku: '',
  oem_code: '',
  price: '',
  stock: 0,
  description: '',
  category: '',
  brand: ''
})

const selectedFiles = ref([])
const imagePreviews = ref([])

const formatPrice = (value) => {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    const img = product.images.find(i => i.is_main) || product.images[0]
    return img.image.startsWith('http') ? img.image : `https://dls-auto-pecas-api.onrender.com${img.image}`
  }
  return null
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const [prodRes, catRes, brandRes] = await Promise.all([
      api.get('/products/'),
      api.get('/categories/'),
      api.get('/brands/')
    ])
    products.value = prodRes.data.results || prodRes.data
    categories.value = catRes.data.results || catRes.data
    brands.value = brandRes.data.results || brandRes.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const filteredProducts = computed(() => {
  let result = products.value

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.sku && p.sku.toLowerCase().includes(q)) || 
      (p.oem_code && p.oem_code.toLowerCase().includes(q))
    )
  }

  if (filters.value.category) {
    const cat = filters.value.category.toString()
    result = result.filter(p => p.category && p.category.toString() === cat)
  }

  if (filters.value.brand) {
    const br = filters.value.brand.toString()
    result = result.filter(p => p.brand && p.brand.toString() === br)
  }

  if (filters.value.stock === 'in_stock') {
    result = result.filter(p => p.stock > 0)
  } else if (filters.value.stock === 'out_of_stock') {
    result = result.filter(p => p.stock <= 0)
  }

  return result
})

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    brand: '',
    stock: ''
  }
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    selectedFiles.value.push(file)
    imagePreviews.value.push(URL.createObjectURL(file))
  })
  event.target.value = ''
}

const removeImage = (index) => {
  selectedFiles.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

const openModal = (product = null) => {
  selectedFiles.value = []
  imagePreviews.value = []
  
  if (product) {
    isEditing.value = true
    formData.value = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      oem_code: product.oem_code || '',
      price: product.price,
      stock: product.stock || 0,
      description: product.description || '',
      category: product.category || '',
      brand: product.brand || ''
    }
  } else {
    isEditing.value = false
    formData.value = {
      id: null,
      name: '',
      sku: '',
      oem_code: '',
      price: '',
      stock: 0,
      description: '',
      category: '',
      brand: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveProduct = async () => {
  isSaving.value = true
  try {
    const data = new FormData()
    
    data.append('name', formData.value.name)
    data.append('sku', formData.value.sku)
    data.append('price', formData.value.price)
    data.append('stock', formData.value.stock)

    if (formData.value.oem_code) {
      data.append('oem_code', formData.value.oem_code)
    }
    if (formData.value.description) {
      data.append('description', formData.value.description)
    }
    if (formData.value.category) {
      data.append('category', formData.value.category)
    }
    if (formData.value.brand) {
      data.append('brand', formData.value.brand)
    }

    selectedFiles.value.forEach(file => {
      data.append('uploaded_images', file)
    })

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    if (isEditing.value) {
      await api.patch(`/products/${formData.value.id}/`, data, config)
    } else {
      await api.post('/products/', data, config)
    }
    
    await fetchData()
    closeModal()
  } catch (error) {
    let errorMsg = 'Erro ao salvar produto.'
    if (error.response && error.response.data) {
      console.error('Detalhes do Erro:', error.response.data)
      const errData = error.response.data
      const firstKey = Object.keys(errData)[0]
      errorMsg = `Erro no campo "${firstKey}": ${errData[firstKey]}`
    }
    alert(errorMsg)
  } finally {
    isSaving.value = false
  }
}

const deleteProduct = async (id) => {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    try {
      await api.delete(`/products/${id}/`)
      await fetchData()
    } catch (error) {
      alert('Erro ao excluir produto.')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="admin-products-page">
    <div class="page-header" v-animate>
      <div>
        <h1 class="page-title">Gerenciamento de Produtos</h1>
        <p class="page-subtitle">Controle seu catálogo, estoque e preços.</p>
      </div>
      <button class="btn-primary" @click="openModal(null)">
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
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div class="input-group">
          <select v-model="filters.brand">
            <option value="">Todas as Marcas</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
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
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando produtos...</p>
      </div>
      
      <div class="table-responsive" v-else>
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
                Nenhum produto encontrado.
              </td>
            </tr>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="product-cell">
                  <div class="img-wrapper">
                    <img v-if="getProductImage(product)" :src="getProductImage(product)" :alt="product.name">
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="product-info">
                    <span class="brand">{{ product.brand_name || 'Sem Marca' }}</span>
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
                  <button class="btn-icon edit" title="Editar" @click="openModal(product)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button class="btn-icon delete" title="Excluir" @click="deleteProduct(product.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Produto' : 'Novo Produto' }}</h2>
          <button class="close-modal" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveProduct" class="product-form">
            <div class="form-group full-width">
              <label>Nome da Peça</label>
              <input type="text" v-model="formData.name" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>SKU (Código Interno)</label>
                <input type="text" v-model="formData.sku" required>
              </div>
              <div class="form-group">
                <label>Código OEM</label>
                <input type="text" v-model="formData.oem_code">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Preço (R$)</label>
                <input type="number" step="0.01" v-model="formData.price" required>
              </div>
              <div class="form-group">
                <label>Estoque</label>
                <input type="number" v-model="formData.stock" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Categoria</label>
                <select v-model="formData.category">
                  <option value="" disabled>Selecione...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Marca</label>
                <select v-model="formData.brand">
                  <option value="" disabled>Selecione...</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
              </div>
            </div>

            <div class="form-group full-width">
              <label>Imagens do Produto</label>
              <div class="file-upload-box">
                <input type="file" multiple accept="image/*" @change="handleFileUpload" class="file-input">
                <div class="upload-placeholder" v-if="imagePreviews.length === 0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span>Clique para selecionar várias imagens</span>
                </div>
                <div class="image-previews" v-else>
                  <div class="preview-item" v-for="(img, idx) in imagePreviews" :key="idx">
                    <img :src="img" alt="Preview">
                    <button type="button" class="remove-img" @click="removeImage(idx)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group full-width">
              <label>Descrição</label>
              <textarea v-model="formData.description" rows="3"></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal" :disabled="isSaving">Cancelar</button>
              <button type="submit" class="btn-save" :disabled="isSaving">
                {{ isSaving ? 'Salvando...' : 'Salvar Produto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

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

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
  font-weight: 600;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-light);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background-color: var(--surface-color);
  width: 100%;
  max-width: 650px;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-main);
  font-weight: 800;
}

.close-modal {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
}

.close-modal:hover {
  color: #ef4444;
}

.close-modal svg {
  width: 1.5rem;
  height: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}

.form-group input, .form-group select, .form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: var(--primary-light);
}

.file-upload-box {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: var(--bg-color);
  transition: border-color 0.2s;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-upload-box:hover {
  border-color: var(--primary-light);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-muted);
  gap: 0.5rem;
}

.upload-placeholder svg {
  width: 2rem;
  height: 2rem;
}

.upload-placeholder span {
  font-size: 0.85rem;
  font-weight: 600;
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  z-index: 20;
}

.preview-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background-color: #fff;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: #ef4444;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  z-index: 30;
}

.remove-img svg {
  width: 12px;
  height: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-cancel, .btn-save {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-main);
}

.btn-cancel:hover {
  background-color: var(--surface-hover);
}

.btn-save {
  background-color: var(--primary-light);
  border: none;
  color: #ffffff;
}

.btn-save:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn-save:disabled, .btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 1.25rem;
  }
}
</style>