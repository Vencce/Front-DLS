<template>
  <div class="product-management-page">
    <div class="page-header" v-animate>
      <div>
        <h1 class="page-title">Gestão de Produtos</h1>
        <p class="page-subtitle">Adicione, edite e gerencie o estoque da loja.</p>
      </div>
      <button class="btn-primary" @click="openModal">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Produto
      </button>
    </div>

    <div class="panel" v-animate>
      <div class="panel-header">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="Buscar por SKU ou nome..." @keyup.enter="fetchProducts">
          <button class="search-btn" @click="fetchProducts">Buscar</button>
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Produto</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-4">Carregando produtos...</td>
            </tr>
            <tr v-else-if="products.length === 0">
              <td colspan="5" class="text-center py-4">Nenhum produto encontrado.</td>
            </tr>
            <tr v-else v-for="product in products" :key="product.id">
              <td><strong>{{ product.sku }}</strong></td>
              <td>
                <div class="product-name-cell">
                  <span class="text-main">{{ product.name }}</span>
                  <span class="text-muted text-sm">{{ product.brand_name }} | {{ product.category_name }}</span>
                </div>
              </td>
              <td class="font-bold text-main">{{ formatPrice(product.price) }}</td>
              <td>
                <span :class="['status-badge', product.stock > 0 ? 'status-paid' : 'status-pending']">
                  {{ product.stock }} un.
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn text-blue" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="action-btn text-red" title="Excluir" @click="deleteProduct(product.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" v-if="isModalOpen" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Cadastrar Novo Produto</h2>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form class="modal-body" @submit.prevent="saveProduct">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="name">Nome do Produto</label>
              <input type="text" id="name" v-model="formData.name" required>
            </div>
            
            <div class="form-group">
              <label for="sku">SKU</label>
              <input type="text" id="sku" v-model="formData.sku" required>
            </div>
            
            <div class="form-group">
              <label for="oem_code">Código Original (OEM)</label>
              <input type="text" id="oem_code" v-model="formData.oem_code">
            </div>

            <div class="form-group">
              <label for="price">Preço (R$)</label>
              <input type="number" id="price" v-model="formData.price" step="0.01" required>
            </div>

            <div class="form-group">
              <label for="stock">Estoque Inicial</label>
              <input type="number" id="stock" v-model="formData.stock" required>
            </div>

            <div class="form-group">
              <label for="brand">Marca</label>
              <select id="brand" v-model="formData.brand" required>
                <option value="" disabled>Selecione a marca</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="category">Categoria</label>
              <select id="category" v-model="formData.category" required>
                <option value="" disabled>Selecione a categoria</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="image">Imagem do Produto</label>
              <input type="file" id="image" @change="handleImageUpload" accept="image/*">
            </div>

            <div class="form-group full-width">
              <label for="description">Descrição do Produto</label>
              <textarea id="description" v-model="formData.description" rows="4" required></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Salvando...' : 'Salvar Produto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../services/api'

const products = ref([])
const brands = ref([])
const categories = ref([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const isModalOpen = ref(false)
const imageFile = ref(null)

const formData = reactive({
  name: '',
  sku: '',
  oem_code: '',
  description: '',
  price: '',
  stock: 0,
  weight_kg: 0.0,
  brand: '',
  category: ''
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await api.get('/catalog/products/', {
      params: { search: searchQuery.value }
    })
    products.value = response.data.results || response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const fetchDependencies = async () => {
  try {
    const [brandsRes, categoriesRes] = await Promise.all([
      api.get('/catalog/brands/'),
      api.get('/catalog/categories/')
    ])
    brands.value = brandsRes.data.results || brandsRes.data
    categories.value = categoriesRes.data.results || categoriesRes.data
  } catch (error) {
    console.error(error)
  }
}

const openModal = () => {
  resetForm()
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const resetForm = () => {
  formData.name = ''
  formData.sku = ''
  formData.oem_code = ''
  formData.description = ''
  formData.price = ''
  formData.stock = 0
  formData.weight_kg = 0.0
  formData.brand = ''
  formData.category = ''
  imageFile.value = null
  const fileInput = document.getElementById('image')
  if (fileInput) fileInput.value = ''
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
  }
}

const saveProduct = async () => {
  saving.value = true
  try {
    const productResponse = await api.post('/catalog/products/', formData)
    const productId = productResponse.data.id

    if (imageFile.value) {
      const imageFormData = new FormData()
      imageFormData.append('product', productId)
      imageFormData.append('image', imageFile.value)
      imageFormData.append('is_main', true)

      await api.post('/catalog/images/', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }

    await fetchProducts()
    closeModal()
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return
  try {
    await api.delete(`/catalog/products/${id}/`)
    await fetchProducts()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchProducts()
  fetchDependencies()
})
</script>

<style scoped>
.product-management-page {
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.btn-primary svg {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.panel {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.search-box {
  display: flex;
  gap: 0.5rem;
  max-width: 400px;
}

.search-box input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s ease;
}

.search-box input:focus {
  border-color: var(--primary-light);
}

.search-btn {
  background-color: var(--surface-hover);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 0 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background-color: var(--border-color);
}

.table-responsive {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background-color: var(--surface-hover);
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
}

.admin-table td {
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.admin-table tr:hover td {
  background-color: var(--surface-hover);
}

.admin-table tr:last-child td {
  border-bottom: none;
}

.product-name-cell {
  display: flex;
  flex-direction: column;
}

.text-main { color: var(--text-main); }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: 0.8rem; }
.font-bold { font-weight: 700; }
.text-center { text-align: center; }
.py-4 { padding-top: 2rem; padding-bottom: 2rem; }

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
}

.status-paid {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.status-pending {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.action-btn:hover {
  background-color: var(--border-color);
}

.text-blue { color: #3b82f6; }
.text-red { color: #ef4444; }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  max-width: 800px;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: var(--surface-hover);
  color: var(--text-main);
}

.close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text-main);
  background-color: var(--bg-color);
  outline: none;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.form-group input[type="file"] {
  padding: 0.6rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary-light);
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-secondary {
  background-color: var(--surface-hover);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--border-color);
}
</style>