<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'
import { useThemeStore } from '../../stores/themeStore'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const cartStore = useCartStore()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const isUserMenuOpen = ref(false)

const userInitial = computed(() => {
  return authStore.userName ? authStore.userName.charAt(0).toUpperCase() : 'U'
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/catalogo', query: { search: searchQuery.value } })
    searchQuery.value = ''
  }
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleLogout = () => {
  authStore.logout()
  isUserMenuOpen.value = false
  router.push('/')
}

const closeMenu = (e) => {
  if (!e.target.closest('.user-dropdown-container')) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<template>
  <header class="main-header" :class="themeStore.theme">
    <div class="header-content">
      <div class="container header-grid">
        <router-link to="/" class="brand-logo">
          <img src="../../assets/logo.png" alt="DLS Auto Peças" class="logo-image" />
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
          <button class="action-item icon-only" @click="themeStore.toggleTheme()">
            <svg v-if="themeStore.theme === 'light'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </button>

          <router-link v-if="!authStore.isAuthenticated" to="/admin/login" class="action-item login-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>Entrar ou Cadastrar</span>
          </router-link>

          <div v-else class="user-dropdown-container">
            <button class="action-item user-btn" @click="toggleUserMenu">
              <div class="user-avatar">{{ userInitial }}</div>
              <span class="user-name-display hide-mobile">Olá, {{ authStore.userName.split(' ')[0] }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="dropdown-icon hide-mobile"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>

            <div class="dropdown-menu" :class="{ 'is-active': isUserMenuOpen }">
              <div class="dropdown-header">
                <strong>{{ authStore.userName }}</strong>
                <span>{{ authStore.user?.email }}</span>
              </div>
              <router-link v-if="authStore.isSuperuser" to="/admin" class="dropdown-item" @click="isUserMenuOpen = false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Painel Admin
              </router-link>
              <router-link to="/minha-conta" class="dropdown-item" @click="isUserMenuOpen = false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Minha Conta
              </router-link>
              <router-link to="/meus-pedidos" class="dropdown-item" @click="isUserMenuOpen = false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Meus Pedidos
              </router-link>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-action" @click="handleLogout">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sair
              </button>
            </div>
          </div>

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
          <router-link to="/sobre" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Nossa Loja
          </router-link>
          <a href="https://wa.me/5547999999999" target="_blank" class="nav-link whatsapp-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Compre Pelo Whatsapp
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.main-header {
  background-color: #008f4c;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 1.25rem 1.25rem;
  transition: background-color 0.3s ease;
  z-index: 40;
  position: relative;
}

.bottom-nav {
  background-color: #008f4c;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.main-header.dark {
  background-color: var(--surface-color);
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
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

.main-header.dark .user-btn {
  border-color: var(--border-color);
}

.main-header.dark .user-avatar {
  background-color: var(--bg-color);
  color: var(--primary-light);
}

.main-header.dark .search-container input {
  background-color: var(--bg-color);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.main-header.dark .search-btn {
  color: var(--primary-light);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
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

.logo-image {
  height: 3.5rem;
  width: auto;
  object-fit: contain;
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

.user-dropdown-container {
  position: relative;
}

.user-btn {
  border: 1px solid #ffffff;
  border-radius: 2rem;
  padding: 0.3rem 0.6rem 0.3rem 0.3rem;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.user-name-display {
  font-weight: 700;
  font-size: 0.85rem;
  white-space: nowrap;
}

.dropdown-icon {
  width: 1rem !important;
  height: 1rem !important;
  transition: transform 0.2s ease;
}

.dropdown-menu.is-active ~ .user-btn .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-menu.is-active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.dropdown-header strong {
  color: var(--text-main);
  font-size: 0.9rem;
}

.dropdown-header span {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background-color 0.2s;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item svg {
  width: 1.25rem !important;
  height: 1.25rem !important;
  color: var(--text-muted);
}

.dropdown-item:hover {
  background-color: var(--bg-color);
  color: var(--primary-light);
}

.dropdown-item:hover svg {
  color: var(--primary-light);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 0.25rem 0;
}

.logout-action {
  color: #ef4444;
}

.logout-action svg {
  color: #ef4444;
}

.logout-action:hover {
  background-color: rgba(239, 68, 68, 0.05);
  color: #ef4444;
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