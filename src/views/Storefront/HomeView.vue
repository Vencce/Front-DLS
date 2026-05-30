<template>
  <div class="home-page">
    <section class="hero-section" v-animate>
      <div class="container hero-grid">
        <div class="hero-text">
          <span class="hero-badge">Especialistas em Linha Pesada</span>
          <h1>Alta Performance para o seu Motor Diesel</h1>
          <p>Encontre as melhores peças com qualidade original e garantia de fábrica. Compre agora e não deixe sua frota parar.</p>
          <div class="hero-actions">
            <router-link to="/catalogo" class="btn-primary">Ver Catálogo Completo</router-link>
            <a href="#destaques" class="btn-secondary">Nossas Ofertas</a>
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
            <h3>Pagamento Facilitado</h3>
            <p>Em até 12x no cartão ou 5% OFF no PIX</p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </div>
          <div class="benefit-text">
            <h3>Estoque Garantido</h3>
            <p>Amplo catálogo a pronta entrega</p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="benefit-text">
            <h3>Qualidade Original</h3>
            <p>Trabalhamos com as melhores marcas</p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
          </div>
          <div class="benefit-text">
            <h3>Envio Rápido</h3>
            <p>Despachamos para todo o Brasil</p>
          </div>
        </div>
      </div>
    </section>

    <section class="categories-section container" v-animate>
      <div class="section-header">
        <h2>Busque por Categoria</h2>
        <router-link to="/catalogo" class="view-all">Ver todas as categorias &rarr;</router-link>
      </div>
      <div class="categories-grid">
        <router-link to="/catalogo?search=injecao" class="category-card">
          <div class="category-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3>Sistemas de Injeção</h3>
          <p>Bicos, Bombas e Sensores</p>
        </router-link>
        <router-link to="/catalogo?search=motor" class="category-card">
          <div class="category-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h3>Componentes de Motor</h3>
          <p>Pistões, Anéis e Bronzinas</p>
        </router-link>
        <router-link to="/catalogo?search=filtros" class="category-card">
          <div class="category-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </div>
          <h3>Filtros</h3>
          <p>Ar, Óleo e Combustível</p>
        </router-link>
        <router-link to="/catalogo?search=eletrica" class="category-card">
          <div class="category-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
          </div>
          <h3>Elétrica</h3>
          <p>Módulos, Chicotes e Relés</p>
        </router-link>
      </div>
    </section>

    <section id="destaques" class="products-section container" v-animate>
      <div class="section-header">
        <h2>Destaques da Loja</h2>
        <router-link to="/catalogo" class="view-all">Ver todas as ofertas &rarr;</router-link>
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

    <section class="newsletter-section container" v-animate>
      <div class="newsletter-content">
        <div class="newsletter-text">
          <h2>Fique por dentro das novidades!</h2>
          <p>Cadastre seu e-mail e receba ofertas exclusivas, cupons de desconto e dicas de manutenção para o seu veículo.</p>
        </div>
        <form class="newsletter-form" @submit.prevent>
          <input type="email" placeholder="Digite seu melhor e-mail" required>
          <button type="submit">Inscrever-se</button>
        </form>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
}

.home-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding-bottom: 4rem;
}

.hero-section {
  padding: 4rem 0 6rem 0;
  background-color: var(--bg-color);
  position: relative;
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
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
}

.hero-badge {
  display: inline-block;
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
  color: var(--text-main);
}

.hero-text p {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  color: var(--text-muted);
  max-width: 90%;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.hero-preview {
  position: relative;
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
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .preview-cards {
    grid-template-columns: 1fr 1fr;
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
}

.preview-card:hover {
  transform: translateY(-8px);
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
  margin-bottom: 5rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.benefit-card {
  background-color: var(--surface-color);
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.icon-wrapper {
  background-color: var(--primary-light-bg);
  color: var(--primary-light);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
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
  margin: 0 0 0.25rem 0;
}

.benefit-text p {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.75rem;
  color: var(--primary-dark);
  margin: 0;
  font-weight: 800;
}

.view-all {
  color: var(--primary-light);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  transition: opacity 0.2s;
}

.view-all:hover {
  opacity: 0.8;
}

.categories-section {
  margin-bottom: 5rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-card:hover {
  border-color: var(--primary-light);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 168, 89, 0.15);
}

.category-icon {
  width: 4rem;
  height: 4rem;
  background-color: var(--surface-hover);
  color: var(--primary-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon {
  background-color: var(--primary-light);
  color: #ffffff;
}

.category-icon svg {
  width: 2rem;
  height: 2rem;
}

.category-card h3 {
  color: var(--text-main);
  font-size: 1.125rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.category-card p {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
}

.products-section {
  margin-bottom: 5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 0;
  color: var(--text-muted);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
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

.newsletter-section {
  background-color: var(--primary-light-bg);
  padding: 4rem 2rem;
  border-radius: 1.5rem;
}

.newsletter-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.newsletter-text h2 {
  font-size: 2rem;
  color: var(--primary-dark);
  margin: 0 0 1rem 0;
  font-weight: 900;
}

.newsletter-text p {
  color: var(--text-main);
  font-size: 1.05rem;
  margin: 0 0 2rem 0;
}

.newsletter-form {
  display: flex;
  width: 100%;
  gap: 0.5rem;
}

@media (max-width: 640px) {
  .newsletter-form {
    flex-direction: column;
  }
}

.newsletter-form input {
  flex-grow: 1;
  padding: 1rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  font-size: 1rem;
  outline: none;
  background-color: var(--surface-color);
  color: var(--text-main);
}

.newsletter-form input:focus {
  border-color: var(--primary-light);
}

.newsletter-form button {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.newsletter-form button:hover {
  background-color: var(--primary-hover);
}
</style>