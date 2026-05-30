<template>
  <header class="main-header" :class="themeStore.theme">
    <div class="promo-banner">
      <div class="container promo-content">
        <span class="promo-brand">DLS</span>
        <span class="promo-text">Condição especial para a sua frota</span>
        <span class="promo-highlight">Frete Grátis acima de R$ 500,00</span>
        <router-link to="/catalogo" class="promo-link">Saiba mais</router-link>
      </div>
    </div>

    <div class="header-content">
      <div class="container header-grid">
        <router-link to="/" class="brand-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <div class="brand-text">
            <span class="logo-dls">DLS</span>
            <span class="logo-auto">AUTO PEÇAS</span>
          </div>
        </router-link>

        <div class="search-container">
          <input 
            type="text" 
            placeholder="O que você deseja encontrar para o seu veículo?" 
            v-model="searchQuery" 
            @keyup.enter="handleSearch"
          >
          <button class="search-btn" @click="handleSearch">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div class="user-actions">
          <button class="action-item icon-only" @click="themeStore.toggleTheme()" title="Alternar Tema">
            <svg v-if="themeStore.theme === 'light'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </button>

          <router-link to="/admin/login" class="action-item login-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>Entrar ou Cadastrar</span>
          </router-link>

          <router-link to="/ajuda" class="action-item icon-only hide-mobile">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </router-link>

          <button class="action-item icon-only hide-mobile notification-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span class="notification-dot"></span>
          </button>

          <button class="action-item cart-item" @click="cartStore.openCart">
            <div class="cart-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span class="cart-badge" v-if="cartStore.totalItems > 0">{{ cartStore.totalItems }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <nav class="bottom-nav">
      <div class="container nav-grid">
        <button class="categories-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          CATEGORIAS
        </button>
        <div class="nav-links">
          <router-link to="/catalogo" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Catálogo de A a Z
          </router-link>
          <router-link to="/catalogo" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            Super Ofertas
          </router-link>
          <router-link to="/sobre" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Nossas Lojas
          </router-link>
          <router-link to="/catalogo" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            Marcas Exclusivas
          </router-link>
          <a href="https://wa.me/5547999999999" target="_blank" class="nav-link whatsapp-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Compre Pelo Whatsapp
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'
import { useThemeStore } from '../../stores/themeStore'

const router = useRouter()
const cartStore = useCartStore()
const themeStore = useThemeStore()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/catalogo', query: { search: searchQuery.value } })
    searchQuery.value = ''
  }
}
</script>

<style scoped>
/* CORES DO TEMA CLARO (PADRÃO) */
.main-header {
  background-color: #008f4c;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 1.25rem 1.25rem;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.promo-banner {
  background-color: #004d28;
  padding: 0.4rem 0;
  font-size: 0.8rem;
  transition: background-color 0.3s ease;
}

.bottom-nav {
  background-color: #008f4c;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* =========================================
   CORES DO TEMA ESCURO (DARK MODE) 
   ========================================= */
.main-header.dark {
  background-color: var(--surface-color);
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
}

.main-header.dark .promo-banner {
  background-color: var(--bg-color);
}

.main-header.dark .bottom-nav {
  background-color: var(--surface-color);
  border-top: 1px solid var(--border-color);
}

.main-header.dark .brand-logo,
.main-header.dark .action-item,
.main-header.dark .categories-btn,
.main-header.dark .nav-link {
  color: var(--text-main);
}

.main-header.dark .search-container input {
  background-color: var(--bg-color);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.main-header.dark .search-btn {
  color: var(--primary-light);
}
/* ========================================= */

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
}

.promo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  text-align: center;
}

.promo-brand {
  font-weight: 900;
  font-style: italic;
  font-size: 1.1rem;
}

.promo-text {
  font-weight: 500;
}

.promo-highlight {
  font-weight: 800;
  font-size: 0.95rem;
}

.promo-link {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.75rem;
  transition: background-color 0.2s;
  margin-left: 0.5rem;
}

.promo-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.header-content {
  padding: 0.75rem 0;
}

.header-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #ffffff;
  flex-shrink: 0;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-dls {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.logo-auto {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.search-container {
  flex-grow: 1;
  max-width: 650px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-container input {
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 0.9rem;
  color: #111827;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-container input::placeholder {
  color: #6b7280;
}

.search-btn {
  position: absolute;
  right: 0.25rem;
  background: none;
  border: none;
  color: #008f4c;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-shrink: 0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: opacity 0.2s;
}

.action-item:hover {
  opacity: 0.8;
}

.action-item svg {
  width: 1.5rem;
  height: 1.5rem;
}

.notification-wrapper {
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 0;
  right: 2px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid #008f4c;
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ef4444;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 800;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
}

.nav-grid {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.categories-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 0.75rem 0;
  cursor: pointer;
}

.categories-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-links::-webkit-scrollbar {
  display: none;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  padding: 0.75rem 0;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-link svg {
  width: 1.1rem;
  height: 1.1rem;
}

@media (max-width: 1024px) {
  .header-grid {
    flex-wrap: wrap;
  }
  .search-container {
    order: 3;
    max-width: 100%;
    width: 100%;
  }
  .hide-mobile {
    display: none;
  }
  .login-item span {
    display: none;
  }
  .nav-grid {
    gap: 1rem;
  }
  .nav-links {
    gap: 1rem;
  }
}
</style>