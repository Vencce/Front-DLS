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
                <a href="https://wa.me/554799997315" target="_blank" rel="noopener" class="contact-link">(47) 9999-7315</a>
              </div>
            </li>
            <li>
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div class="contact-detail">
                <strong>E-mail</strong>
                <a href="mailto:contato@dlsautopecas.com.br" class="contact-link">contato@dlsautopecas.com.br</a>
              </div>
            </li>
            <li>
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div class="contact-detail">
                <strong>Localização</strong>
                <span>Rua São Paulo, 3339, Itaum<br>Joinville - SC, 89210-001, Brasil</span>
              </div>
            </li>
          </ul>
          
          <button class="btn-primary" @click="router.push('/catalogo')">Acessar Nosso Catálogo</button>
        </div>

        <div class="map-embed">
          <iframe
            src="https://www.google.com/maps?q=Rua%20S%C3%A3o%20Paulo%2C%203339%2C%20Itaum%2C%20Joinville%20-%20SC%2C%2089210-001%2C%20Brasil&output=embed"
            width="100%"
            height="100%"
            style="border:0"
            allowfullscreen="false"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Localização DLS Auto Peças no Google Maps"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  background-color: var(--bg-color);
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #00361c 0%, #008f4c 100%);
  color: #ffffff;
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
  margin: 0 auto;
}

.hero-section h1 {
  font-weight: 900;
  letter-spacing: -0.02em;
}

.hero-section p {
  opacity: 0.9;
  margin: 0;
}

.main-content {
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.story-grid {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: grid;
}

.badge-title {
  display: inline-block;
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
  border-radius: 999px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.story-text h2 {
  color: var(--text-main);
  font-weight: 800;
  line-height: 1.2;
}

.story-text p {
  color: var(--text-muted);
}

.values-cards {
  display: grid;
}

.value-card {
  background-color: var(--bg-color);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  transition: transform 0.3s, border-color 0.3s;
}

.value-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-light);
}

.icon-wrapper {
  background-color: var(--primary-light);
  color: #ffffff;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.value-card h3 {
  color: var(--text-main);
  font-weight: 700;
}

.value-card p {
  color: var(--text-muted);
  margin: 0;
}

.story-image {
  height: 100%;
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
}

.image-placeholder span {
  font-weight: 600;
}

.contact-section {
  display: grid;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  overflow: hidden;
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.contact-info h2 {
  color: var(--text-main);
  font-weight: 800;
}

.contact-info p {
  color: var(--text-muted);
}

.contact-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
}

.contact-icon {
  background-color: var(--surface-hover);
  color: var(--primary-light);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-detail {
  display: flex;
  flex-direction: column;
}

.contact-detail strong {
  color: var(--text-main);
  font-weight: 700;
}

.contact-detail span {
  color: var(--text-muted);
}

.btn-primary {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  text-align: center;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.map-embed {
  background-color: var(--surface-hover);
}

.map-embed iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.contact-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: var(--primary-light);
  text-decoration: underline;
}

@media (max-width: 575.98px) {
  /* Estilos para smartphones pequenos e médios */
  .about-page {
    padding-bottom: 4rem;
  }
  .hero-section {
    padding: 4rem 1rem 5rem;
  }
  .hero-section h1 {
    font-size: 2.25rem;
    margin-bottom: 1rem;
  }
  .hero-section p {
    font-size: 1.05rem;
    line-height: 1.6;
  }
  .main-content {
    padding: 0 1rem;
    margin-top: -2.5rem;
  }
  .story-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 2rem 1.5rem;
    margin-bottom: 4rem;
  }
  .badge-title {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    margin-bottom: 1.5rem;
  }
  .story-text h2 {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
  }
  .story-text p {
    font-size: 1rem;
    margin-bottom: 1.25rem;
    line-height: 1.8;
  }
  .values-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  .value-card {
    padding: 1.5rem;
  }
  .icon-wrapper {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }
  .icon-wrapper svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .value-card h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  .value-card p {
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .image-placeholder {
    min-height: 300px;
    gap: 1rem;
  }
  .image-placeholder svg {
    width: 3.5rem;
    height: 3.5rem;
  }
  .image-placeholder span {
    font-size: 1.1rem;
  }
  .contact-section {
    grid-template-columns: 1fr;
  }
  .contact-info {
    padding: 2.5rem 1.5rem;
  }
  .contact-info h2 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
  .contact-info p {
    font-size: 1rem;
    margin-bottom: 2.5rem;
    line-height: 1.7;
  }
  .contact-list {
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }
  .contact-list li {
    gap: 1rem;
  }
  .contact-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
  .contact-icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .contact-detail {
    gap: 0.4rem;
  }
  .contact-detail strong {
    font-size: 0.95rem;
  }
  .contact-detail span, .contact-link {
    font-size: 0.95rem;
    line-height: 1.5;
  }
  .btn-primary {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    border-radius: 0.75rem;
  }
  .map-embed {
    min-height: 300px;
  }
}

/* 📱 Celulares grandes / modo paisagem (telas de 576px até 767px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Estilos para smartphones maiores */
  .about-page {
    padding-bottom: 5rem;
  }
  .hero-section {
    padding: 5rem 1.5rem 6rem;
  }
  .hero-section h1 {
    font-size: 2.75rem;
    margin-bottom: 1.25rem;
  }
  .hero-section p {
    font-size: 1.15rem;
    line-height: 1.6;
  }
  .main-content {
    padding: 0 1.5rem;
    margin-top: -3rem;
  }
  .story-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 2.5rem;
    margin-bottom: 4.5rem;
  }
  .badge-title {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
  .story-text h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  .story-text p {
    font-size: 1.05rem;
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
  .values-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
  }
  .value-card {
    padding: 1.75rem;
  }
  .icon-wrapper {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }
  .icon-wrapper svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .value-card h3 {
    font-size: 1.15rem;
    margin-bottom: 0.5rem;
  }
  .value-card p {
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .image-placeholder {
    min-height: 350px;
    gap: 1.25rem;
  }
  .image-placeholder svg {
    width: 4rem;
    height: 4rem;
  }
  .image-placeholder span {
    font-size: 1.15rem;
  }
  .contact-section {
    grid-template-columns: 1fr;
  }
  .contact-info {
    padding: 3rem 2.5rem;
  }
  .contact-info h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .contact-info p {
    font-size: 1.05rem;
    margin-bottom: 2.5rem;
    line-height: 1.7;
  }
  .contact-list {
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }
  .contact-list li {
    gap: 1.25rem;
  }
  .contact-icon {
    width: 2.75rem;
    height: 2.75rem;
  }
  .contact-icon svg {
    width: 1.35rem;
    height: 1.35rem;
  }
  .contact-detail {
    gap: 0.4rem;
  }
  .contact-detail strong {
    font-size: 1rem;
  }
  .contact-detail span, .contact-link {
    font-size: 1rem;
    line-height: 1.6;
  }
  .btn-primary {
    width: auto;
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 0.75rem;
  }
  .map-embed {
    min-height: 350px;
  }
}

/* 📟 Tablets / iPad (telas de 768px até 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Estilos específicos para iPad e tablets parecidos */
  .about-page {
    padding-bottom: 6rem;
  }
  .hero-section {
    padding: 6rem 2rem 7rem;
  }
  .hero-section .container {
    max-width: 800px;
  }
  .hero-section h1 {
    font-size: 3.25rem;
    margin-bottom: 1.25rem;
  }
  .hero-section p {
    font-size: 1.25rem;
    line-height: 1.6;
  }
  .main-content {
    padding: 0 2rem;
    margin-top: -3.5rem;
  }
  .story-grid {
    grid-template-columns: 1fr;
    gap: 4rem;
    padding: 3.5rem;
    margin-bottom: 5rem;
  }
  .badge-title {
    padding: 0.6rem 1.25rem;
    font-size: 0.85rem;
    margin-bottom: 1.75rem;
  }
  .story-text h2 {
    font-size: 2.25rem;
    margin-bottom: 1.5rem;
  }
  .story-text p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
  .values-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 3.5rem;
  }
  .value-card {
    padding: 1.75rem;
  }
  .icon-wrapper {
    width: 3.25rem;
    height: 3.25rem;
    margin-bottom: 1.25rem;
  }
  .icon-wrapper svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .value-card h3 {
    font-size: 1.15rem;
    margin-bottom: 0.6rem;
  }
  .value-card p {
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .image-placeholder {
    min-height: 400px;
    gap: 1.5rem;
  }
  .image-placeholder svg {
    width: 4.5rem;
    height: 4.5rem;
  }
  .image-placeholder span {
    font-size: 1.25rem;
  }
  .contact-section {
    grid-template-columns: 1fr;
  }
  .contact-info {
    padding: 4rem 3.5rem;
  }
  .contact-info h2 {
    font-size: 2.25rem;
    margin-bottom: 1.25rem;
  }
  .contact-info p {
    font-size: 1.1rem;
    margin-bottom: 3rem;
    line-height: 1.8;
  }
  .contact-list {
    gap: 1.75rem;
    margin-bottom: 3rem;
  }
  .contact-list li {
    gap: 1.25rem;
  }
  .contact-icon {
    width: 3rem;
    height: 3rem;
  }
  .contact-icon svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .contact-detail {
    gap: 0.5rem;
  }
  .contact-detail strong {
    font-size: 1.05rem;
  }
  .contact-detail span, .contact-link {
    font-size: 1.05rem;
    line-height: 1.6;
  }
  .btn-primary {
    padding: 1.1rem 2.25rem;
    font-size: 1.05rem;
    border-radius: 0.75rem;
  }
  .map-embed {
    min-height: 400px;
  }
}

/* 💻 Notebooks / Telas médias (telas de 992px até 1199px) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Estilos para notebooks e monitores menores */
  .about-page {
    padding-bottom: 6rem;
  }
  .hero-section {
    padding: 7rem 2rem 8rem;
  }
  .hero-section .container {
    max-width: 800px;
  }
  .hero-section h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
  }
  .hero-section p {
    font-size: 1.25rem;
    line-height: 1.6;
  }
  .main-content {
    max-width: 1000px;
    padding: 0 2rem;
    margin-top: -4rem;
  }
  .story-grid {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 4rem;
    padding: 4rem;
    margin-bottom: 6rem;
  }
  .badge-title {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }
  .story-text h2 {
    font-size: 2.5rem;
    margin-bottom: 1.75rem;
  }
  .story-text p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.85;
  }
  .values-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 3.5rem;
  }
  .value-card {
    padding: 2rem;
  }
  .icon-wrapper {
    width: 3.5rem;
    height: 3.5rem;
    margin-bottom: 1.25rem;
  }
  .icon-wrapper svg {
    width: 1.6rem;
    height: 1.6rem;
  }
  .value-card h3 {
    font-size: 1.15rem;
    margin-bottom: 0.6rem;
  }
  .value-card p {
    font-size: 1rem;
    line-height: 1.6;
  }
  .image-placeholder {
    min-height: 100%;
    gap: 1.5rem;
  }
  .image-placeholder svg {
    width: 4.5rem;
    height: 4.5rem;
  }
  .image-placeholder span {
    font-size: 1.25rem;
  }
  .contact-section {
    grid-template-columns: 1fr 1fr;
  }
  .contact-info {
    padding: 4rem;
  }
  .contact-info h2 {
    font-size: 2.5rem;
    margin-bottom: 1.25rem;
  }
  .contact-info p {
    font-size: 1.1rem;
    margin-bottom: 3rem;
    line-height: 1.8;
  }
  .contact-list {
    gap: 2rem;
    margin-bottom: 3.5rem;
  }
  .contact-list li {
    gap: 1.5rem;
  }
  .contact-icon {
    width: 3.25rem;
    height: 3.25rem;
  }
  .contact-icon svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .contact-detail {
    gap: 0.5rem;
  }
  .contact-detail strong {
    font-size: 1.05rem;
  }
  .contact-detail span, .contact-link {
    font-size: 1.05rem;
    line-height: 1.6;
  }
  .btn-primary {
    padding: 1.1rem 2.25rem;
    font-size: 1.05rem;
    border-radius: 0.75rem;
  }
  .map-embed {
    min-height: 100%;
  }
}

/* 🖥️ Computadores / Monitores grandes (telas acima de 1200px) */
@media (min-width: 1200px) {
  /* Estilos para computadores de mesa */
  .about-page {
    padding-bottom: 7rem;
  }
  .hero-section {
    padding: 8rem 2rem 9rem;
  }
  .hero-section .container {
    max-width: 800px;
  }
  .hero-section h1 {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
  .hero-section p {
    font-size: 1.35rem;
    line-height: 1.7;
  }
  .main-content {
    max-width: 1250px;
    padding: 0 2rem;
    margin-top: -4.5rem;
  }
  .story-grid {
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    padding: 5rem;
    margin-bottom: 7rem;
  }
  .badge-title {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }
  .story-text h2 {
    font-size: 2.75rem;
    margin-bottom: 2rem;
  }
  .story-text p {
    font-size: 1.15rem;
    margin-bottom: 1.75rem;
    line-height: 1.85;
  }
  .values-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 4rem;
  }
  .value-card {
    padding: 2.5rem;
  }
  .icon-wrapper {
    width: 3.5rem;
    height: 3.5rem;
    margin-bottom: 1.5rem;
  }
  .icon-wrapper svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  .value-card h3 {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
  }
  .value-card p {
    font-size: 1rem;
    line-height: 1.6;
  }
  .image-placeholder {
    min-height: 100%;
    gap: 1.5rem;
  }
  .image-placeholder svg {
    width: 5rem;
    height: 5rem;
  }
  .image-placeholder span {
    font-size: 1.35rem;
  }
  .contact-section {
    grid-template-columns: 1fr 1fr;
  }
  .contact-info {
    padding: 5rem;
  }
  .contact-info h2 {
    font-size: 2.75rem;
    margin-bottom: 1.5rem;
  }
  .contact-info p {
    font-size: 1.15rem;
    margin-bottom: 3.5rem;
    line-height: 1.8;
  }
  .contact-list {
    gap: 2rem;
    margin-bottom: 3.5rem;
  }
  .contact-list li {
    gap: 1.5rem;
  }
  .contact-icon {
    width: 3.5rem;
    height: 3.5rem;
  }
  .contact-icon svg {
    width: 1.6rem;
    height: 1.6rem;
  }
  .contact-detail {
    gap: 0.5rem;
  }
  .contact-detail strong {
    font-size: 1.1rem;
  }
  .contact-detail span, .contact-link {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  .btn-primary {
    padding: 1.25rem 2.5rem;
    font-size: 1.1rem;
    border-radius: 0.75rem;
  }
  .map-embed {
    min-height: 100%;
  }
}
</style>