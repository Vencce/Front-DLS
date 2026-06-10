<template>
  <div class="home-page">
    <section class="hero-section" v-animate>
      <div class="container hero-grid">
        <div class="hero-text">
          <span class="hero-badge">Peças Originais Usadas</span>
          <h1>Alta Performance com o Melhor Custo-Benefício</h1>
          <p>Especialistas em peças usadas para o seu motor diesel. Todos os produtos possuem Nota Fiscal, embalagem super reforçada e garantia de 3 meses protegida por lacre de segurança.</p>
          <div class="hero-actions">
            <router-link to="/catalogo" class="btn-primary">Ver Catálogo Completo</router-link>
            <a href="#diretrizes" class="btn-secondary">Como Comprar</a>
          </div>
        </div>
        
        <div class="hero-preview">
          <div v-if="productStore.loading" class="loading-preview">
            <div class="spinner"></div>
          </div>
          <div v-else class="preview-cards">
            <div 
              class="preview-card" 
              v-for="product in heroProducts" 
              :key="product.id"
              @click="goToProduct(product.id)"
            >
              <div class="preview-image">
                <img v-if="product.images && product.images.length > 0" :src="product.images[0].image" :alt="product.name">
                <div v-else class="image-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <div class="preview-info">
                <span class="preview-brand">{{ product.brand_name || 'DLS Auto Peças' }}</span>
                <h3 class="preview-title">{{ product.name }}</h3>
                <span class="preview-price">{{ formatPrice(product.price) }}</span>
              </div>
              <div class="preview-action">
                <span>Comprar</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="benefits-section container" v-animate>
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
          <div class="benefit-text">
            <h3>Desconto à Vista</h3>
            <p>5% de desconto para compras diretas no Depósito ou PIX</p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="benefit-text">
            <h3>Garantia de 3 Meses</h3>
            <p>Proteção garantida de 90 dias através de nossos lacres de segurança</p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div class="benefit-text">
            <h3>Procedência Comprovada</h3>
            <p>Todos os nossos produtos usados acompanham Nota Fiscal</p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div class="benefit-text">
            <h3>Embalagem Segura</h3>
            <p>Plástico bolha, lona, papelão e caixas de madeira para itens frágeis</p>
          </div>
        </div>
      </div>
    </section>

    <section id="diretrizes" class="info-section container" v-animate>
      <div class="section-header">
        <h2>Regras e Dúvidas Frequentes</h2>
        <span class="view-all">Transparência DLS Peças</span>
      </div>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-number">1</div>
          <div class="info-content">
            <h3>Condição dos Produtos</h3>
            <p>Trabalhamos exclusivamente com peças usadas. Embora não possuamos a quilometragem exata das peças, informamos o ano e modelo do veículo doador. Se o anúncio indicar "Avaria" ou "Com Detalhe", verifique as fotos para conferir o defeito.</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-number">2</div>
          <div class="info-content">
            <h3>Verifique a Compatibilidade</h3>
            <p>Antes de efetuar a compra, compare as fotos do anúncio e, principalmente, o código original da peça (OEM). Recomendamos mostrar o anúncio ao seu mecânico de confiança para garantir que sirva no seu veículo.</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-number">3</div>
          <div class="info-content">
            <h3>Lacres e Garantia</h3>
            <p>Oferecemos garantia de 3 meses. Para que ela seja válida, todos os produtos são enviados com lacres de segurança exclusivos. A remoção ou rompimento deste lacre antes do prazo anula a garantia.</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-number">4</div>
          <div class="info-content">
            <h3>Instalação Profissional</h3>
            <p>A instalação não deve ser feita por qualquer pessoa. Recomendamos fortemente que seja realizada por profissionais especializados do ramo para evitar danos à vida útil da peça e ao seu veículo.</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-number">5</div>
          <div class="info-content">
            <h3>Prazos e Frete</h3>
            <p>Os envios são feitos estritamente dentro do prazo estabelecido. Para fretes fora do cálculo automático, utilize o campo de perguntas. Em caso de devolução ou arrependimento, por favor, contate o vendedor antes de abrir uma reclamação.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="destaques" class="products-section container" v-animate>
      <div class="section-header">
        <h2>Destaques da Loja</h2>
        <router-link to="/catalogo" class="view-all">Ver todas as peças &rarr;</router-link>
      </div>
      
      <div v-if="productStore.loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando produtos...</p>
      </div>
      
      <div v-else class="product-grid">
        <div class="product-card" v-for="product in featuredProducts" :key="product.id">
          <div class="product-image">
            <img v-if="product.images && product.images.length > 0" :src="product.images[0].image" :alt="product.name" class="catalog-img">
            <div v-else class="image-placeholder">Sem Imagem</div>
          </div>
          <div class="product-info">
            <span class="product-brand">{{ product.brand_name || 'DLS Auto Peças' }}</span>
            <h3 class="product-title">{{ product.name }}</h3>
            <div class="product-price-row">
              <span class="product-price">{{ formatPrice(product.price) }}</span>
            </div>
            <button @click="goToProduct(product.id)" class="add-to-cart-btn">Ver Detalhes</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../../stores/productStore'

const router = useRouter()
const productStore = useProductStore()

const heroProducts = computed(() => {
  return productStore.products.slice(0, 2)
})

const featuredProducts = computed(() => {
  return productStore.products.slice(0, 4)
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const goToProduct = (id) => {
  router.push(`/produto/${id}`)
}

onMounted(() => {
  productStore.fetchProducts({ page: 1 })
})
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  box-sizing: border-box;
}

.home-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding-bottom: 4rem;
  overflow-x: hidden;
}

.hero-section {
  padding: 3rem 0;
  background-color: var(--bg-color);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}

@media (min-width: 768px) {
  .hero-section {
    padding: 4rem 0 6rem 0;
  }
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
  box-sizing: border-box;
}

@media (min-width: 992px) {
  .hero-grid {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 4rem;
  }
}

.hero-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
}

.hero-badge {
  display: inline-block;
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  text-align: center;
}

@media (min-width: 640px) {
  .hero-badge {
    font-size: 0.85rem;
  }
}

.hero-text h1 {
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  color: var(--text-main);
  word-wrap: break-word;
}

@media (min-width: 768px) {
  .hero-text h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    letter-spacing: -0.03em;
  }
}

.hero-text p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: var(--text-muted);
  width: 100%;
}

@media (min-width: 768px) {
  .hero-text p {
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    max-width: 90%;
  }
}

.hero-actions {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .hero-actions {
    flex-direction: row;
    width: auto;
  }
}

.btn-primary {
  background-color: var(--primary-light);
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .btn-primary {
    width: auto;
  }
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(0, 168, 89, 0.4);
}

.btn-secondary {
  background-color: var(--surface-hover);
  color: var(--text-main);
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .btn-secondary {
    width: auto;
  }
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.hero-preview {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.loading-preview {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  border: 4px solid rgba(0, 168, 89, 0.1);
  border-left-color: var(--primary-light);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.preview-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .preview-cards {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
}

.preview-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1.25rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  width: 100%;
  box-sizing: border-box;
}

.preview-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.preview-image {
  height: 160px;
  background-color: var(--surface-hover);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.preview-card:hover .preview-image img {
  transform: scale(1.05);
}

.image-placeholder {
  color: var(--border-color);
}

.image-placeholder svg {
  width: 3rem;
  height: 3rem;
}

.preview-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.preview-brand {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.preview-title {
  font-size: 1rem;
  color: var(--text-main);
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary-dark);
  margin-bottom: 1rem;
}

.preview-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px dashed var(--border-color);
  color: var(--primary-light);
  font-weight: 700;
  font-size: 0.9rem;
}

.preview-action svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s ease;
}

.preview-card:hover .preview-action svg {
  transform: translateX(4px);
}

.benefits-section {
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .benefits-section {
    margin-bottom: 5rem;
  }
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .benefits-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.benefit-card {
  background-color: var(--surface-color);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  width: 100%;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.icon-wrapper {
  background-color: var(--primary-light-bg);
  color: var(--primary-light);
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .icon-wrapper {
    width: 3.5rem;
    height: 3.5rem;
  }
}

.icon-wrapper svg {
  width: 1.5rem;
  height: 1.5rem;
}

.benefit-text h3 {
  color: var(--text-main);
  font-size: 1rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
}

@media (min-width: 640px) {
  .benefit-text h3 {
    font-size: 1.1rem;
  }
}

.benefit-text p {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
}

.info-section {
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .info-section {
    margin-bottom: 5rem;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.info-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
}

.info-number {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--primary-light);
  color: #ffffff;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
}

.info-content h3 {
  font-size: 1.1rem;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
  font-weight: 800;
}

.info-content p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

@media (min-width: 640px) {
  .section-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
  }
}

.section-header h2 {
  font-size: 1.5rem;
  color: var(--primary-dark);
  margin: 0;
  font-weight: 800;
}

@media (min-width: 640px) {
  .section-header h2 {
    font-size: 1.75rem;
  }
}

.view-all {
  color: var(--primary-light);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

@media (min-width: 640px) {
  .view-all {
    font-size: 0.95rem;
  }
}

.view-all:hover {
  opacity: 0.8;
}

.products-section {
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .products-section {
    margin-bottom: 5rem;
  }
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.product-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.product-image {
  height: 200px;
  background-color: var(--surface-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

.catalog-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.product-card:hover .catalog-img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.25rem;
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
  font-size: 1rem;
  color: var(--text-main);
  margin: 0 0 1rem 0;
  line-height: 1.4;
  font-weight: 700;
  flex-grow: 1;
}

.product-price-row {
  margin-bottom: 1.25rem;
}

.product-price {
  font-size: 1.25rem;
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
</style>