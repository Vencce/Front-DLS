<template>
  <div class="home-page">
    <section class="hero-section" v-animate>
      <div class="hero-background-glow"></div>
      <div class="container hero-grid">
        <div class="hero-text">
          <span class="hero-badge">Peças Originais Usadas</span>
          <h1>Alta Performance com o Melhor Custo-Benefício</h1>
          <p>Especialistas em peças usadas para o seu motor diesel. Todos os produtos possuem Nota Fiscal, embalagem super reforçada e garantia de 3 meses protegida por lacre de segurança.</p>
          <div class="hero-actions">
            <router-link to="/catalogo" class="btn-hero-primary">Ver Catálogo Completo</router-link>
            <a href="#diretrizes" class="btn-hero-secondary">Como Comprar</a>
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
            <p>Proteção garantida de 90 dias através de nossos lacres</p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div class="benefit-text">
            <h3>Procedência Certa</h3>
            <p>Todos os nossos produtos usados acompanham Nota Fiscal</p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div class="benefit-text">
            <h3>Embalagem Segura</h3>
            <p>Itens protegidos com plástico bolha e caixas de madeira</p>
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
        <div class="spinner-dark"></div>
        <p>Carregando produtos...</p>
      </div>
      
      <div v-else class="product-grid">
        <div class="product-card" v-for="product in featuredProducts" :key="product.id" @click="goToProduct(product.id)">
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
            <button class="add-to-cart-btn">Ver Detalhes</button>
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
  max-width: 1250px;
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
  padding: 4rem 0 8rem 0;
  background: linear-gradient(135deg, #005f32 0%, #008f4c 100%);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}

.hero-background-glow {
  position: absolute;
  top: -30%;
  right: -10%;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 1;
  pointer-events: none;
}

.hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  box-sizing: border-box;
}

@media (min-width: 992px) {
  .hero-grid {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 5rem;
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
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 0.6rem 1.5rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.hero-text h1 {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
}

@media (min-width: 768px) {
  .hero-text h1 {
    font-size: 3.75rem;
    margin-bottom: 1.5rem;
    letter-spacing: -0.03em;
  }
}

.hero-text p {
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  width: 100%;
}

@media (min-width: 768px) {
  .hero-text p {
    font-size: 1.15rem;
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

.btn-hero-primary {
  background-color: #ffffff;
  color: #007038;
  padding: 1.1rem 2.25rem;
  border-radius: 999px;
  font-weight: 800;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  border: 2px solid #ffffff;
}

.btn-hero-primary:hover {
  background-color: #f8f9fa;
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
}

.btn-hero-secondary {
  background-color: transparent;
  color: #ffffff;
  padding: 1.1rem 2.25rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.6);
  text-align: center;
}

.btn-hero-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
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
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-left-color: #ffffff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.spinner-dark {
  border: 4px solid var(--border-color);
  border-left-color: var(--primary-light);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.preview-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .preview-cards {
    grid-template-columns: 1fr 1fr;
  }
}

.preview-card {
  background-color: #ffffff;
  border: none;
  border-radius: 1.5rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  box-sizing: border-box;
}

.preview-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
}

.preview-image {
  height: 180px;
  background-color: #f8f9fa;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  overflow: hidden;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s ease;
}

.preview-card:hover .preview-image img {
  transform: scale(1.08);
}

.image-placeholder {
  color: #a1a1aa;
}

.image-placeholder svg {
  width: 3.5rem;
  height: 3.5rem;
}

.preview-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.preview-brand {
  font-size: 0.75rem;
  color: #71717a;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: 0.4rem;
}

.preview-title {
  font-size: 1.05rem;
  color: #18181b;
  font-weight: 800;
  line-height: 1.35;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-price {
  font-size: 1.35rem;
  font-weight: 900;
  color: #007038;
  margin-bottom: 1.25rem;
}

.preview-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 2px dashed #f4f4f5;
  color: #008f4c;
  font-weight: 800;
  font-size: 0.95rem;
}

.preview-action svg {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
}

.preview-card:hover .preview-action svg {
  transform: translateX(6px);
}

.benefits-section {
  margin-top: -4rem;
  position: relative;
  z-index: 10;
  margin-bottom: 5rem;
}

@media (min-width: 768px) {
  .benefits-section {
    margin-top: -5rem;
    margin-bottom: 6rem;
  }
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .benefits-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.benefit-card {
  background-color: var(--surface-color);
  padding: 1.75rem;
  border-radius: 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  width: 100%;
}

.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-light);
}

.icon-wrapper {
  background: linear-gradient(135deg, rgba(0, 143, 76, 0.15) 0%, rgba(0, 143, 76, 0.05) 100%);
  color: var(--primary-light);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper svg {
  width: 1.75rem;
  height: 1.75rem;
}

.benefit-text h3 {
  color: var(--text-main);
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0 0 0.4rem 0;
}

.benefit-text p {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

.products-section {
  margin-bottom: 5rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .section-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.section-header h2 {
  font-size: 1.75rem;
  color: var(--text-main);
  margin: 0;
  font-weight: 900;
  letter-spacing: -0.02em;
}

@media (min-width: 640px) {
  .section-header h2 {
    font-size: 2rem;
  }
}

.view-all {
  color: var(--primary-light);
  text-decoration: none;
  font-weight: 800;
  font-size: 0.95rem;
  transition: opacity 0.2s;
  display: inline-block;
}

.view-all:hover {
  opacity: 0.8;
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
  border-radius: 1.25rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.product-card:hover {
  transform: translateY(-6px);
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
  width: 100%;
  box-sizing: border-box;
}

.catalog-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s ease;
}

.product-card:hover .catalog-img {
  transform: scale(1.08);
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
  font-weight: 800;
}

.product-title {
  font-size: 1.05rem;
  color: var(--text-main);
  margin: 0 0 1.25rem 0;
  line-height: 1.4;
  font-weight: 800;
  flex-grow: 1;
}

.product-price-row {
  margin-bottom: 1.25rem;
}

.product-price {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--primary-dark);
}

.add-to-cart-btn {
  width: 100%;
  background-color: var(--surface-hover);
  color: var(--primary-dark);
  border: none;
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover .add-to-cart-btn {
  background-color: var(--primary-light);
  color: #ffffff;
}

.info-section {
  margin-bottom: 5rem;
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
  border-radius: 1.25rem;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 143, 76, 0.3);
}

.info-number {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%);
  color: #ffffff;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 143, 76, 0.3);
}

.info-content h3 {
  font-size: 1.15rem;
  color: var(--text-main);
  margin: 0 0 0.6rem 0;
  font-weight: 800;
}

.info-content p {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}
</style>