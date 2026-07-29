<script setup>
import { RouterLink } from 'vue-router'
</script>

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
      <div class="container">
        <p>&copy; 2026 DLS Auto Peças. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.main-footer {
  background-color: var(--footer-bg);
  color: var(--footer-text);
  border-top: 6px solid var(--primary-light);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
}

.brand-logo-footer {
  font-weight: 800;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-dls {
  color: var(--header-text);
  font-style: italic;
}

.logo-text {
  color: var(--primary-light);
}

.footer-section h4 {
  font-weight: 700;
  color: var(--header-text);
  margin-top: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-section p {
  line-height: 1.6;
  margin: 0;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.footer-section ul a {
  color: var(--footer-text);
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-section ul a:hover {
  color: var(--primary-light);
  transform: translateX(6px);
}

.contact-info {
  display: flex;
  align-items: flex-start;
}

.contact-info svg {
  color: var(--primary-light);
  flex-shrink: 0;
}

.footer-bottom {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--text-muted);
}

@media (max-width: 575.98px) {
  /* Estilos para smartphones pequenos e médios */
  .container {
    padding: 0 1.25rem;
  }
  .main-footer {
    padding-top: 2.5rem;
  }
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  .brand-section {
    grid-column: span 2;
  }
  .brand-logo-footer {
    font-size: 1.5rem;
  }
  .brand-section p {
    margin-top: 0.75rem;
    font-size: 0.85rem;
  }
  .footer-section h4 {
    font-size: 0.95rem;
    margin-bottom: 0.75rem;
  }
  .footer-section ul {
    gap: 0.6rem;
  }
  .footer-section ul a {
    font-size: 0.85rem;
  }
  .contact-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  .contact-info svg {
    width: 1.15rem;
    height: 1.15rem;
  }
  .contact-info p {
    font-size: 0.85rem;
    line-height: 1.4;
  }
  .footer-bottom {
    margin-top: 2.5rem;
    padding: 1rem 0;
    font-size: 0.75rem;
  }
}

/* 📱 Celulares grandes / modo paisagem (telas de 576px até 767px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Estilos para smartphones maiores */
  .container {
    padding: 0 1.5rem;
  }
  .main-footer {
    padding-top: 3rem;
  }
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  .brand-section {
    grid-column: span 2;
  }
  .brand-logo-footer {
    font-size: 1.75rem;
  }
  .brand-section p {
    margin-top: 1rem;
    font-size: 0.9rem;
    max-width: 100%;
  }
  .footer-section h4 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  .footer-section ul {
    gap: 0.75rem;
  }
  .footer-section ul a {
    font-size: 0.9rem;
  }
  .contact-info {
    gap: 0.75rem;
  }
  .contact-info svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .contact-info p {
    font-size: 0.9rem;
  }
  .footer-bottom {
    margin-top: 3rem;
    padding: 1.25rem 0;
    font-size: 0.8rem;
  }
}

/* 📟 Tablets / iPad (telas de 768px até 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Estilos específicos para iPad e tablets parecidos */
  .container {
    padding: 0 1.5rem;
  }
  .main-footer {
    padding-top: 4rem;
  }
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
  .brand-section {
    grid-column: span 2;
  }
  .brand-logo-footer {
    font-size: 2rem;
  }
  .brand-section p {
    margin-top: 1.25rem;
    font-size: 0.95rem;
    max-width: 500px;
  }
  .footer-section h4 {
    font-size: 1.1rem;
    margin-bottom: 1.25rem;
  }
  .footer-section ul {
    gap: 0.85rem;
  }
  .footer-section ul a {
    font-size: 0.95rem;
  }
  .contact-info {
    gap: 1rem;
  }
  .contact-info svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .contact-info p {
    font-size: 0.95rem;
  }
  .footer-bottom {
    margin-top: 4rem;
    padding: 1.5rem 0;
    font-size: 0.85rem;
  }
}

/* 💻 Notebooks / Telas médias (telas de 992px até 1199px) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Estilos para notebooks e monitores menores */
  .container {
    padding: 0 1.5rem;
  }
  .main-footer {
    padding-top: 4.5rem;
  }
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 3rem;
  }
  .brand-logo-footer {
    font-size: 2.1rem;
  }
  .brand-section p {
    margin-top: 1.5rem;
    font-size: 1rem;
    max-width: 350px;
  }
  .footer-section h4 {
    font-size: 1.15rem;
    margin-bottom: 1.5rem;
  }
  .footer-section ul {
    gap: 1rem;
  }
  .footer-section ul a {
    font-size: 0.95rem;
  }
  .contact-info {
    gap: 1rem;
  }
  .contact-info svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .contact-info p {
    font-size: 0.95rem;
  }
  .footer-bottom {
    margin-top: 4.5rem;
    padding: 1.5rem 0;
    font-size: 0.9rem;
  }
}

/* 🖥️ Computadores / Monitores grandes (telas acima de 1200px) */
@media (min-width: 1200px) {
  /* Estilos para computadores de mesa */
  .container {
    max-width: 1250px;
    padding: 0 1.5rem;
  }
  .main-footer {
    padding-top: 5rem;
  }
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 4rem;
  }
  .brand-logo-footer {
    font-size: 2.25rem;
  }
  .brand-section p {
    margin-top: 1.5rem;
    font-size: 1rem;
    max-width: 400px;
  }
  .footer-section h4 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
  .footer-section ul {
    gap: 1rem;
  }
  .footer-section ul a {
    font-size: 1rem;
  }
  .contact-info {
    gap: 1.25rem;
  }
  .contact-info svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .contact-info p {
    font-size: 1rem;
  }
  .footer-bottom {
    margin-top: 5rem;
    padding: 1.5rem 0;
    font-size: 0.9rem;
  }
}
</style>