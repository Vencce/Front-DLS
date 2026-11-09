<script setup>
import { RouterLink } from 'vue-router'
import logo from '../../assets/logo.png'

// Dados da avaliação no Google — editar aqui se a nota/quantidade mudar
const googleReviews = {
  rating: 5.0,
  totalReviews: 11,
  url: 'https://share.google/GKWcaZabIs3nsWEOw'
}
</script>

<template>
  <footer class="main-footer">
    <div class="container footer-grid">
      <div class="footer-section brand-section">
        <router-link to="/" class="brand-logo-footer">
          <img src="../../../dist/assets/logo-CKOVm2g7.png" alt="DLS Auto Peças" class="footer-logo-image">
        </router-link>
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

      <div class="footer-section">
        <h4>Contato</h4>
        <a class="contact-email" href="mailto:comerciodlsautopecas@gmail.com">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>comerciodlsautopecas@gmail.com</span>
        </a>

        <div class="social-links">
          <a
            href="https://www.instagram.com/dls_autopecas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da DLS Auto Peças"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61568975219116&locale=sk_SK#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook da DLS Auto Peças"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
          </a>
        </div>
      </div>

      <div class="footer-section">
        <h4>Avaliações</h4>
        <div class="google-rating">
          <span class="rating-number">{{ googleReviews.rating.toFixed(1) }}</span>
          <span class="stars">
            <svg
              v-for="n in 5"
              :key="n"
              :class="{ filled: n <= Math.round(googleReviews.rating) }"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
        </div>
        <p class="reviews-count">{{ googleReviews.totalReviews }} avaliações no Google</p>
        <a
          v-if="googleReviews.url"
          :href="googleReviews.url"
          target="_blank"
          rel="noopener noreferrer"
          class="reviews-link"
        >
          Ver avaliações no Google
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="payment-methods">
          <span class="payment-label">Formas de pagamento:</span>
          <div class="payment-icons">
            <span class="payment-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="6" width="2" height="12"></rect>
                <rect x="6" y="6" width="1" height="12"></rect>
                <rect x="9" y="6" width="3" height="12"></rect>
                <rect x="14" y="6" width="1" height="12"></rect>
                <rect x="17" y="6" width="2" height="12"></rect>
                <rect x="21" y="6" width="1" height="12"></rect>
              </svg>
              Boleto
            </span>
            <span class="payment-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
              </svg>
              Pix
            </span>
            <span class="payment-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              Crédito
            </span>
            <span class="payment-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
                <line x1="6" y1="15" x2="10" y2="15"></line>
              </svg>
              Débito
            </span>
          </div>
        </div>

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
  text-decoration: none;
  width: fit-content;
}

.footer-logo-image {
  height: 32px;
  width: auto;
  display: block;
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

/* Contato (e-mail) e redes sociais */
.contact-email {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--footer-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-email svg {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--primary-light);
  flex-shrink: 0;
}

.contact-email:hover {
  color: var(--primary-light);
}

.social-links {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 1px solid var(--footer-text);
  color: var(--footer-text);
  opacity: 0.85;
  transition: all 0.2s ease;
}

.social-links a svg {
  width: 1.1rem;
  height: 1.1rem;
}

.social-links a:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
  color: #ffffff;
  opacity: 1;
}

/* Avaliações do Google */
.google-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-number {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--header-text);
}

.stars {
  display: flex;
  gap: 0.15rem;
}

.stars svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: none;
  stroke: var(--footer-text);
  stroke-width: 1.5;
  opacity: 0.5;
}

.stars svg.filled {
  fill: #fbbf24;
  stroke: #fbbf24;
  opacity: 1;
}

.reviews-count {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  opacity: 0.85;
}

.reviews-link {
  display: inline-block;
  margin-top: 0.6rem;
  color: var(--primary-light);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  transition: opacity 0.2s ease;
}

.reviews-link:hover {
  text-decoration: underline;
  opacity: 0.9;
}

/* Formas de pagamento */
.payment-methods {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.payment-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.75;
}

.payment-icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.9;
}

.payment-item svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-light);
  flex-shrink: 0;
}

.footer-bottom {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--text-muted);
}

@media (max-width: 575.98px) {
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
  .footer-logo-image {
    height: 32px;
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
  .contact-email {
    font-size: 0.85rem;
  }
  .payment-icons {
    gap: 0.75rem;
  }
  .payment-item {
    font-size: 0.75rem;
  }
  .footer-bottom {
    margin-top: 2.5rem;
    padding: 1rem 0;
    font-size: 0.75rem;
  }
}

/* 📱 Celulares grandes / modo paisagem (telas de 576px até 767px) */
@media (min-width: 576px) and (max-width: 767.98px) {
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
  .footer-logo-image {
    height: 36px;
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
  .contact-email {
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
  .footer-logo-image {
    height: 42px;
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
  .contact-email {
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
  .container {
    padding: 0 1.5rem;
  }
  .main-footer {
    padding-top: 4.5rem;
  }
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 2.5rem;
  }
  .footer-logo-image {
    height: 46px;
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
  .contact-email {
    font-size: 0.9rem;
  }
  .payment-methods {
    flex-direction: row;
    justify-content: center;
  }
  .footer-bottom {
    margin-top: 4.5rem;
    padding: 1.5rem 0;
    font-size: 0.9rem;
  }
}

/* 🖥️ Computadores / Monitores grandes (telas acima de 1200px) */
@media (min-width: 1200px) {
  .container {
    max-width: 1250px;
    padding: 0 1.5rem;
  }
  .main-footer {
    padding-top: 5rem;
  }
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 3rem;
  }
  .footer-logo-image {
    height: 50px;
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
  .contact-email {
    font-size: 0.95rem;
  }
  .payment-methods {
    flex-direction: row;
    justify-content: center;
  }
  .footer-bottom {
    margin-top: 5rem;
    padding: 1.5rem 0;
    font-size: 0.9rem;
  }
}
</style>