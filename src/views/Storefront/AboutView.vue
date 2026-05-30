<template>
  <div class="about-page">
    <section class="hero-section">
      <div class="container hero-content">
        <h1>Sobre a DLS Auto Peças</h1>
        <p>Especialistas em performance e durabilidade para a linha Diesel desde a nossa fundação.</p>
      </div>
    </section>

    <section class="history-section">
      <div class="container history-layout">
        <div class="history-text">
          <h2>Nossa Trajetória</h2>
          <p>A DLS Auto Peças nasceu com a missão de suprir uma necessidade latente no mercado brasileiro: o fornecimento rápido, confiável e especializado de componentes de alta performance para motores a diesel.</p>
          <p>Com sede em Joinville, Santa Catarina, estruturamos uma operação focada em entender a dor do caminhoneiro, do frotista e do mecânico especializado. Sabemos que um veículo comercial parado representa prejuízo, e é por isso que nossa logística e nosso atendimento são pautados pela urgência e pela precisão técnica.</p>
          <p>Trabalhamos apenas com as melhores marcas do mercado, garantindo que cada bico injetor, turbina ou filtro entregue carregue a certificação de qualidade que a sua máquina exige para rodar com segurança.</p>
        </div>
        <div class="history-image">
          <div class="image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h5M10 21v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <h2 class="section-title">O que nos move</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Qualidade Comprovada</h3>
            <p>Trabalhamos exclusivamente com peças originais e de reposição de primeira linha, homologadas pelos fabricantes.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Agilidade na Entrega</h3>
            <p>Processamento expresso de pedidos e parcerias com transportadoras ágeis para que a sua peça chegue o quanto antes.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3>Atendimento Técnico</h3>
            <p>Nossa equipe conhece de motor diesel. Oferecemos suporte especializado para garantir que você compre a peça exata.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container cta-content">
        <h2>Precisa de ajuda para encontrar uma peça?</h2>
        <p>Explore nosso catálogo completo ou entre em contato com nossos especialistas.</p>
        <div class="cta-buttons">
          <router-link to="/catalogo" class="btn-primary">Acessar Catálogo</router-link>
          <a href="#" class="btn-secondary">Falar com Consultor</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero-section {
  background-color: #004d28;
  color: #ffffff;
  padding: 5rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::after {
  content: "";
  position: absolute;
  bottom: -50px;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: #f9fafb;
  transform: skewY(-2deg);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 1rem 0;
}

.hero-content p {
  font-size: 1.25rem;
  color: #e6f4ea;
  margin: 0;
  line-height: 1.6;
}

.history-section {
  padding: 5rem 0;
  background-color: #f9fafb;
}

.history-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 992px) {
  .history-layout {
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
  }
}

.history-text h2 {
  font-size: 2.25rem;
  color: #004d28;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
}

.history-text p {
  font-size: 1.125rem;
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.history-text p:last-child {
  margin-bottom: 0;
}

.history-image {
  width: 100%;
  height: 400px;
  background-color: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #e6f4ea;
}

.image-placeholder svg {
  width: 5rem;
  height: 5rem;
  color: #00a859;
  opacity: 0.5;
}

.values-section {
  padding: 5rem 0;
  background-color: #ffffff;
}

.section-title {
  text-align: center;
  font-size: 2.25rem;
  color: #004d28;
  font-weight: 800;
  margin: 0 0 3rem 0;
  letter-spacing: -0.02em;
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .values-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.value-card {
  background-color: #f9fafb;
  padding: 3rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #f3f4f6;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  border-color: #e6f4ea;
}

.value-icon {
  width: 4rem;
  height: 4rem;
  background-color: #e6f4ea;
  color: #00a859;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
}

.value-icon svg {
  width: 2rem;
  height: 2rem;
}

.value-card h3 {
  font-size: 1.25rem;
  color: #111827;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.value-card p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.cta-section {
  padding: 6rem 0;
  background-color: #e6f4ea;
  text-align: center;
}

.cta-content {
  max-width: 700px;
}

.cta-content h2 {
  font-size: 2.25rem;
  color: #004d28;
  font-weight: 800;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.cta-content p {
  font-size: 1.125rem;
  color: #004d28;
  opacity: 0.8;
  margin: 0 0 2.5rem 0;
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 640px) {
  .cta-buttons {
    flex-direction: row;
  }
}

.btn-primary {
  background-color: #00a859;
  color: #ffffff;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 800;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.btn-primary:hover {
  background-color: #008f4c;
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(0, 168, 89, 0.4);
}

.btn-secondary {
  background-color: #ffffff;
  color: #004d28;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 800;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  border: 2px solid #00a859;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  transform: translateY(-2px);
}
</style>