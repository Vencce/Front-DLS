<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="about-page">
    <div class="hero-section" v-animate>
      <div class="container">
        <h1>A DLS Auto Peças</h1>
        <p>Especialistas em linha pesada, unindo qualidade, procedência e confiança para o seu veículo.</p>
      </div>
    </div>

    <div class="container main-content">
      <div class="story-grid" v-animate>
        <div class="story-text">
          <span class="badge-title">Nossa História</span>
          <h2>Tradição e Força no Mercado</h2>
          <p>Fundada com o objetivo de fornecer as melhores soluções em peças para veículos de linha pesada, a DLS Auto Peças se destaca pelo compromisso absoluto com a qualidade e o atendimento altamente especializado.</p>
          <p>Nosso foco principal é o fornecimento de peças com procedência garantida. Cada item do nosso estoque passa por avaliações rigorosas para garantir o máximo desempenho e segurança para o seu veículo ou para a frota da sua empresa.</p>
          <p>Trabalhamos com as principais marcas do mercado e possuímos um estoque diversificado para atender às necessidades dos nossos clientes com agilidade, transparência e eficiência.</p>
          
          <div class="values-cards">
            <div class="value-card">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3>Qualidade</h3>
              <p>Peças rigorosamente testadas e avaliadas.</p>
            </div>
            <div class="value-card">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3>Agilidade</h3>
              <p>Processamento rápido e foco na entrega.</p>
            </div>
            <div class="value-card">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3>Segurança</h3>
              <p>Garantia de procedência em todo o estoque.</p>
            </div>
          </div>
        </div>
        
        <div class="story-image">
          <div class="image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span>Nossa Estrutura</span>
          </div>
        </div>
      </div>

      <div class="contact-section" v-animate>
        <div class="contact-info">
          <h2>Fale Conosco</h2>
          <p>Nossa equipe de especialistas está pronta para ajudar você a encontrar exatamente a peça que seu veículo precisa para voltar a rodar.</p>
          
          <ul class="contact-list">
            <li>
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div class="contact-detail">
                <strong>Telefone / WhatsApp</strong>
                <span>(00) 00000-0000</span>
              </div>
            </li>
            <li>
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div class="contact-detail">
                <strong>E-mail</strong>
                <span>contato@dlsautopecas.com.br</span>
              </div>
            </li>
            <li>
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div class="contact-detail">
                <strong>Localização</strong>
                <span>Endereço Completo da Loja, 123 - Bairro<br>Cidade, Estado - CEP 00000-000</span>
              </div>
            </li>
          </ul>
          
          <button class="btn-primary" @click="router.push('/catalogo')">Acessar Nosso Catálogo</button>
        </div>

        <div class="map-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          <span>Mapa da Loja</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding-bottom: 5rem;
}

.hero-section {
  background: linear-gradient(135deg, #00361c 0%, #008f4c 100%);
  color: #ffffff;
  padding: 5rem 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  pointer-events: none;
}

.hero-section .container {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.hero-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
}

@media (min-width: 768px) {
  .hero-section {
    padding: 7rem 1.5rem;
  }
  .hero-section h1 {
    font-size: 3.5rem;
  }
  .hero-section p {
    font-size: 1.25rem;
  }
}

.main-content {
  max-width: 1200px;
  margin: -3rem auto 0;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
}

.story-grid {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

@media (min-width: 992px) {
  .story-grid {
    grid-template-columns: 1fr 1fr;
    padding: 4rem;
  }
}

.badge-title {
  display: inline-block;
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
}

.story-text h2 {
  font-size: 2rem;
  color: var(--text-main);
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
}

.story-text p {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 1.25rem;
}

.values-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 3rem;
}

@media (min-width: 640px) {
  .values-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.value-card {
  background-color: var(--bg-color);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  transition: transform 0.3s, border-color 0.3s;
}

.value-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-light);
}

.icon-wrapper {
  width: 3rem;
  height: 3rem;
  background-color: var(--primary-light);
  color: #ffffff;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-wrapper svg {
  width: 1.5rem;
  height: 1.5rem;
}

.value-card h3 {
  font-size: 1.1rem;
  color: var(--text-main);
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.value-card p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.story-image {
  height: 100%;
  min-height: 300px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--surface-hover);
  border: 2px dashed var(--border-color);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 1rem;
}

.image-placeholder svg {
  width: 4rem;
  height: 4rem;
}

.image-placeholder span {
  font-size: 1.1rem;
  font-weight: 600;
}

.contact-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  overflow: hidden;
}

@media (min-width: 992px) {
  .contact-section {
    grid-template-columns: 1fr 1fr;
  }
}

.contact-info {
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

.contact-info h2 {
  font-size: 2rem;
  color: var(--text-main);
  font-weight: 800;
  margin: 0 0 1rem 0;
}

.contact-info p {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 0 2.5rem 0;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0 0 3rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--surface-hover);
  color: var(--primary-light);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.contact-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-detail strong {
  color: var(--text-main);
  font-size: 0.95rem;
  font-weight: 700;
}

.contact-detail span {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.btn-primary {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.map-placeholder {
  background-color: var(--surface-hover);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 1rem;
  min-height: 300px;
}

.map-placeholder svg {
  width: 4rem;
  height: 4rem;
}

.map-placeholder span {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>