<template>
  <footer class="main-footer">
    <div class="container footer-grid">
      <div class="footer-section brand-section">
        <div class="brand-logo-footer">
          <span class="logo-dls">DLS</span> <span class="logo-text">AUTO PEÇAS</span>
        </div>
        <p>Especialistas em peças para linha Diesel. Qualidade, agilidade e performance para o seu veículo comercial.</p>
      </div>
      
      <div class="footer-section">
        <h4>Links Rápidos</h4>
        <ul>
          <li><router-link to="/catalogo">Catálogo de Produtos</router-link></li>
          <li><router-link to="/carrinho">Meu Carrinho</router-link></li>
          <li><router-link to="/minha-conta">Rastrear Pedido</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>Atendimento</h4>
        <div class="contact-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p>Rua São Paulo, 3339</p>
            <p>Joinville - SC</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2026 DLS Auto Peças. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.main-footer {
  background-color: var(--footer-bg);
  color: var(--footer-text);
  padding-top: 4rem;
  border-top: 6px solid var(--primary-light);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.brand-section p {
  margin-top: 1.5rem;
  max-width: 350px;
}

.brand-logo-footer {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.logo-dls {
  color: var(--header-text);
  font-style: italic;
}

.logo-text {
  color: var(--primary-light);
}

.footer-section h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--header-text);
  margin-bottom: 1.5rem;
  margin-top: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-section p {
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-section ul a {
  color: var(--footer-text);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
  display: inline-block;
}

.footer-section ul a:hover {
  color: var(--primary-light);
  transform: translateX(4px);
}

.contact-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-info svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-light);
  flex-shrink: 0;
}

.footer-bottom {
  text-align: center;
  margin-top: 4rem;
  padding: 1.5rem 0;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 0.875rem;
  color: var(--text-muted);
}
</style>