<template>
  <div class="product-page">
    <div class="container" v-if="loading">
      <div class="loading-state">
        <div class="spinner"></div>
      </div>
    </div>
    
    <div class="container" v-else-if="product">
      <div class="breadcrumb">
        <router-link to="/">Início</router-link>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        <router-link to="/catalogo">Catálogo</router-link>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        <span class="current">{{ product.name }}</span>
      </div>

      <div class="product-layout">
        <div class="product-gallery">
          <div class="main-image">
            <img :src="resolveImage(activeImage)" :alt="product.name" v-if="activeImage">
            <div v-else class="image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Sem imagem disponível</span>
            </div>
          </div>
          <div class="thumbnail-list" v-if="product.images && product.images.length > 1">
            <button 
              v-for="img in product.images" 
              :key="img.id"
              class="thumbnail-btn"
              :class="{ active: activeImage === img.image }"
              @click="activeImage = img.image"
            >
              <img :src="resolveImage(img.image)" :alt="product.name">
            </button>
          </div>
        </div>

        <div class="product-info">
          <div class="brand-badge">{{ product.brand_name || 'DLS Auto Peças' }}</div>
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-codes">
            <div class="code-item" v-if="product.sku">
              <span class="label">SKU:</span>
              <span class="value">{{ product.sku }}</span>
            </div>
            <div class="code-item highlight-code" v-if="product.oem_code">
              <span class="label">Código OEM:</span>
              <span class="value">{{ product.oem_code }}</span>
            </div>
          </div>

          <div class="price-section">
            <div class="price">{{ formatPrice(product.price) }}</div>
            <div class="pix-discount">
              <strong>{{ formatPrice(product.price * 0.95) }}</strong> à vista no PIX ou Depósito
            </div>
            <div class="installments">
              ou em até 12x no cartão de crédito
            </div>
          </div>

          <div class="shipping-calc">
            <label for="cep-calc">Calcular Frete e Prazo</label>
            <div class="cep-group">
              <input type="text" id="cep-calc" placeholder="00000-000" maxlength="9">
              <button type="button">Calcular</button>
            </div>
          </div>

          <div class="purchase-actions">
            <div class="qty-selector">
              <button @click="qty > 1 ? qty-- : null" :disabled="qty <= 1">-</button>
              <span>{{ qty }}</span>
              <button @click="qty < product.stock ? qty++ : null" :disabled="qty >= product.stock">+</button>
            </div>
            <button class="btn-buy" @click="handleAddToCart" :disabled="product.stock < 1">
              {{ product.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto Indisponível' }}
            </button>
          </div>

          <div class="security-badges">
            <div class="badge">
              <div class="badge-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div class="badge-text">
                <strong>Garantia de 3 Meses</strong>
                <span>Válida apenas com o lacre de segurança intacto</span>
              </div>
            </div>
            <div class="badge">
              <div class="badge-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div class="badge-text">
                <strong>Compra Segura</strong>
                <span>Todos os produtos acompanham Nota Fiscal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="product-details-tabs">
        <div class="tabs-header">
          <button class="tab-btn active">Detalhes da Peça</button>
        </div>
        <div class="tab-content">
          <div class="description-block">
            <h3>Descrição do Produto</h3>
            <p class="description-text">{{ product.description || 'Nenhuma descrição detalhada fornecida para este produto. Consulte as imagens e o código OEM para confirmar a compatibilidade.' }}</p>
          </div>
          
          <div class="compatibility-section" v-if="product.compatibilities && product.compatibilities.length > 0">
            <h3>Aplicações e Veículos Compatíveis</h3>
            <ul class="compatibility-list">
              <li v-for="(comp, idx) in product.compatibilities" :key="idx">
                <span class="comp-maker">{{ comp.maker }}</span>
                <span class="comp-model">{{ comp.model }}</span>
                <span class="comp-year">{{ comp.start_year }} - {{ comp.end_year }}</span>
              </li>
            </ul>
          </div>

          <div class="important-notice">
            <div class="notice-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div class="notice-text">
              <h3>Atenção antes de comprar</h3>
              <p>Nossas peças são <strong>usadas</strong>. Avalie cuidadosamente as fotos no anúncio para identificar eventuais detalhes ou avarias. Confirme a compatibilidade com seu mecânico utilizando o <strong>Código OEM</strong>. A instalação incorreta pode comprometer o funcionamento do seu veículo. A garantia de devolução não cobre a violação do nosso lacre de segurança exclusivo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const activeImage = ref('')
const qty = ref(1)

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const resolveImage = (imgPath) => {
  if (!imgPath) return ''
  return imgPath.startsWith('http') ? imgPath : `https://dls-auto-pecas-api.onrender.com${imgPath}`
}

const fetchProductDetails = async (id) => {
  loading.value = true
  try {
    const response = await api.get(`/products/${id}/`)
    product.value = response.data
    if (product.value.images && product.value.images.length > 0) {
      const mainImg = product.value.images.find(i => i.is_main) || product.value.images[0]
      activeImage.value = mainImg.image
    }
  } catch (error) {
    console.error('Erro ao carregar produto:', error)
    router.push('/catalogo')
  } finally {
    loading.value = false
  }
}

const handleAddToCart = () => {
  if (!product.value || product.value.stock < 1) return
  
  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: parseFloat(product.value.price),
    brand: product.value.brand_name || 'DLS Auto Peças',
    image: resolveImage(activeImage.value),
    quantity: qty.value
  })
}

onMounted(() => {
  if (route.params.id) {
    fetchProductDetails(route.params.id)
  }
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchProductDetails(newId)
  }
})
</script>

<style scoped>
.product-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding: 2rem 0 5rem 0;
  overflow-x: hidden;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  box-sizing: border-box;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.spinner {
  border: 4px solid rgba(0, 168, 89, 0.1);
  border-left-color: var(--primary-light);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: var(--primary-light);
}

.breadcrumb svg {
  width: 1rem;
  height: 1rem;
}

.breadcrumb .current {
  color: var(--text-main);
  font-weight: 700;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

@media (min-width: 992px) {
  .product-layout {
    grid-template-columns: 1.1fr 0.9fr;
  }
}

.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  aspect-ratio: 4/3;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
  box-sizing: border-box;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-muted);
  gap: 1rem;
}

.image-placeholder svg {
  width: 4rem;
  height: 4rem;
  color: var(--border-color);
}

.thumbnail-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
}

.thumbnail-btn {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  background-color: var(--surface-color);
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnail-btn:hover {
  border-color: var(--text-muted);
}

.thumbnail-btn.active {
  border-color: var(--primary-light);
}

.product-info {
  display: flex;
  flex-direction: column;
}

.brand-badge {
  display: inline-block;
  background-color: var(--surface-hover);
  color: var(--text-main);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  align-self: flex-start;
  border: 1px solid var(--border-color);
}

.product-title {
  font-size: 1.75rem;
  color: var(--text-main);
  margin: 0 0 1.5rem 0;
  font-weight: 800;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .product-title {
    font-size: 2.25rem;
  }
}

.product-codes {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.code-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.code-item .label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
}

.code-item .value {
  font-size: 1rem;
  color: var(--text-main);
  font-weight: 700;
}

.highlight-code .value {
  color: var(--primary-light);
  font-size: 1.1rem;
  background-color: var(--primary-light-bg);
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
}

.price-section {
  margin-bottom: 2rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--primary-dark);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.pix-discount {
  color: var(--primary-light);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.installments {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.shipping-calc {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  padding: 1.25rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.shipping-calc label {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.75rem;
}

.cep-group {
  display: flex;
  gap: 0.5rem;
}

.cep-group input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-size: 1rem;
  outline: none;
}

.cep-group input:focus {
  border-color: var(--primary-light);
}

.cep-group button {
  background-color: var(--surface-hover);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.cep-group button:hover {
  background-color: var(--border-color);
}

.purchase-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-direction: column;
}

@media (min-width: 640px) {
  .purchase-actions {
    flex-direction: row;
  }
}

.qty-selector {
  display: flex;
  align-items: center;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  height: 54px;
}

.qty-selector button {
  background: none;
  border: none;
  color: var(--text-main);
  width: 40px;
  height: 100%;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.qty-selector button:hover:not(:disabled) {
  background-color: var(--surface-hover);
}

.qty-selector button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-selector span {
  width: 40px;
  text-align: center;
  font-weight: 700;
  color: var(--text-main);
}

.btn-buy {
  flex-grow: 1;
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-buy:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.btn-buy:disabled {
  background-color: var(--border-color);
  color: var(--text-muted);
  cursor: not-allowed;
}

.security-badges {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.badge-text {
  display: flex;
  flex-direction: column;
}

.badge-text strong {
  font-size: 0.95rem;
  color: var(--text-main);
}

.badge-text span {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.product-details-tabs {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--surface-hover);
}

.tab-btn {
  background: none;
  border: none;
  padding: 1.25rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
}

.tab-btn.active {
  color: var(--primary-light);
  background-color: var(--surface-color);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--primary-light);
}

.tab-content {
  padding: 2rem;
}

.description-block {
  margin-bottom: 3rem;
}

.description-block h3,
.compatibility-section h3 {
  font-size: 1.25rem;
  color: var(--text-main);
  margin: 0 0 1rem 0;
  font-weight: 800;
}

.description-text {
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 1rem;
  white-space: pre-line;
}

.compatibility-section {
  margin-bottom: 3rem;
}

.compatibility-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .compatibility-list {
    grid-template-columns: 1fr 1fr;
  }
}

.compatibility-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.comp-maker {
  font-weight: 800;
  color: var(--text-main);
}

.comp-model {
  color: var(--text-main);
  font-weight: 600;
}

.comp-year {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-left: auto;
}

.important-notice {
  background-color: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .important-notice {
    flex-direction: row;
  }
}

.notice-icon {
  width: 3rem;
  height: 3rem;
  background-color: #f97316;
  color: #ffffff;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notice-icon svg {
  width: 1.75rem;
  height: 1.75rem;
}

.notice-text h3 {
  color: #c2410c;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 800;
}

.notice-text p {
  color: #9a3412;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.notice-text strong {
  font-weight: 800;
}
</style>