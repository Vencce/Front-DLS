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
const isMobileMenuOpen = ref(false)

const userInitial = computed(() => {
  return authStore.userName ? authStore.userName.charAt(0).toUpperCase() : 'U'
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/catalogo', query: { search: searchQuery.value } })
    searchQuery.value = ''
    isMobileMenuOpen.value = false
  }
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  isUserMenuOpen.value = false
  isMobileMenuOpen.value = false
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
        
        <div class="brand-wrapper">
          <button class="mobile-menu-btn hide-desktop" @click="toggleMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <router-link to="/" class="brand-logo" @click="closeMobileMenu">
            <img src="../../assets/logo.png" alt="DLS Auto Peças" class="logo-image" />
          </router-link>
        </div>

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

          <router-link v-if="!authStore.isAuthenticated" to="/login" class="action-item login-item hide-mobile">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span class="hide-mobile">Entrar ou Cadastrar</span>
          </router-link>
          <router-link v-if="!authStore.isAuthenticated" to="/login" class="action-item hide-desktop">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </router-link>

          <div v-else class="user-dropdown-container hide-mobile">
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

    <nav class="bottom-nav hide-mobile">
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

    <div class="mobile-drawer-overlay hide-desktop" :class="{ 'is-active': isMobileMenuOpen }" @click="closeMobileMenu"></div>

    <div class="mobile-drawer hide-desktop" :class="{ 'is-active': isMobileMenuOpen, 'dark': themeStore.theme === 'dark' }">
      <div class="drawer-header">
        <img src="../../assets/logo.png" alt="DLS Auto Peças" class="drawer-logo" />
        <button class="close-drawer-btn" @click="closeMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="drawer-content">
        <button class="drawer-link">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          Categorias
        </button>
        <router-link to="/catalogo" class="drawer-link" @click="closeMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Catálogo de A a Z
        </router-link>
        <router-link to="/sobre" class="drawer-link" @click="closeMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Nossa Loja
        </router-link>
        <a href="https://wa.me/5547999999999" target="_blank" class="drawer-link whatsapp-link" @click="closeMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Compre Pelo Whatsapp
        </a>

        <div class="drawer-divider"></div>

        <div v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="drawer-link" @click="closeMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Entrar ou Cadastrar
          </router-link>
        </div>
        
        <div v-else>
          <div class="drawer-user-info">
            <div class="user-avatar">{{ userInitial }}</div>
            <div class="user-details">
              <strong>{{ authStore.userName }}</strong>
              <span>{{ authStore.user?.email }}</span>
            </div>
          </div>
          <router-link v-if="authStore.isSuperuser" to="/admin" class="drawer-link" @click="closeMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Painel Admin
          </router-link>
          <router-link to="/minha-conta" class="drawer-link" @click="closeMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Minha Conta
          </router-link>
          <router-link to="/meus-pedidos" class="drawer-link" @click="closeMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Meus Pedidos
          </router-link>
          <button class="drawer-link logout-action" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sair
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background-color: #008f4c;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
  z-index: 40;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
  margin: 0 auto;
  width: 100%;
}

.header-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-menu-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}

.mobile-menu-btn svg {
  width: 1.75rem;
  height: 1.75rem;
}

.main-header.dark .mobile-menu-btn {
  color: var(--text-main);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #ffffff;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.brand-logo:hover {
  transform: scale(1.02);
}

.logo-image {
  width: auto;
  object-fit: contain;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-container input {
  width: 100%;
  border: none;
  color: #111827;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-container input::placeholder {
  color: #6b7280;
}

.search-btn {
  position: absolute;
  background: none;
  border: none;
  color: #008f4c;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.search-btn:hover {
  transform: scale(1.1);
}

.user-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.action-item {
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.action-item:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.user-dropdown-container {
  position: relative;
}

.user-btn {
  border: 1px solid #ffffff;
  border-radius: 2rem;
  background: transparent;
  display: flex;
  align-items: center;
}

.user-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

.user-avatar {
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
}

.user-name-display {
  font-weight: 700;
  white-space: nowrap;
}

.dropdown-icon {
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
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
}

.nav-grid {
  display: flex;
  align-items: center;
}

.categories-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.2s;
}

.categories-btn:hover {
  opacity: 0.8;
}

.nav-links {
  display: flex;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
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
  white-space: nowrap;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.hide-desktop {
  display: none;
}

.mobile-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}

.mobile-drawer-overlay.is-active {
  opacity: 1;
  visibility: visible;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  left: -100%;
  width: 280px;
  height: 100vh;
  background-color: #008f4c;
  z-index: 1001;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.mobile-drawer.dark {
  background-color: var(--surface-color);
  border-right: 1px solid var(--border-color);
}

.mobile-drawer.is-active {
  left: 0;
}

.drawer-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.mobile-drawer.dark .drawer-header {
  border-bottom-color: var(--border-color);
}

.drawer-logo {
  height: 2.25rem;
  width: auto;
  object-fit: contain;
}

.close-drawer-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-drawer-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.mobile-drawer.dark .close-drawer-btn {
  color: var(--text-main);
}

.drawer-content {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-drawer.dark .drawer-link {
  color: var(--text-main);
}

.drawer-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-drawer.dark .drawer-link:hover {
  background-color: var(--surface-hover);
  color: var(--primary-light);
}

.drawer-link svg {
  width: 1.25rem;
  height: 1.25rem;
}

.drawer-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.15);
  margin: 0.75rem 0;
}

.mobile-drawer.dark .drawer-divider {
  background-color: var(--border-color);
}

.drawer-user-info {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.drawer-user-info .user-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-user-info strong {
  color: #ffffff;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer-user-info span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-drawer.dark .drawer-user-info strong {
  color: var(--text-main);
}

.mobile-drawer.dark .drawer-user-info span {
  color: var(--text-muted);
}

@media (max-width: 991.98px) {
  .hide-mobile {
    display: none !important;
  }
  .hide-desktop {
    display: flex;
  }
  .header-grid {
    flex-wrap: wrap;
  }
  .brand-wrapper {
    order: 1;
  }
  .user-actions {
    order: 2;
    margin-left: auto;
  }
  .search-container {
    order: 3;
    width: 100%;
    margin-top: 0.25rem;
  }
}

@media (max-width: 575.98px) {
  /* Estilos para smartphones pequenos e médios */
  .container {
    padding: 0 1rem;
  }
  .header-content {
    padding: 1rem 0;
  }
  .header-grid {
    gap: 1rem;
  }
  .logo-image {
    height: 2.25rem;
  }
  .user-actions {
    gap: 1rem;
  }
  .action-item svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.85rem;
  }
  .search-container input {
    padding: 0.85rem 3rem 0.85rem 1.25rem;
    font-size: 0.95rem;
    border-radius: 999px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }
  .search-btn {
    right: 0.5rem;
    padding: 0.6rem;
  }
  .search-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .cart-badge {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
  }
}

/* 📱 Celulares grandes / modo paisagem (telas de 576px até 767px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Estilos para smartphones maiores */
  .container {
    padding: 0 1.25rem;
  }
  .header-content {
    padding: 1.25rem 0;
  }
  .header-grid {
    gap: 1.25rem;
  }
  .logo-image {
    height: 2.5rem;
  }
  .user-actions {
    gap: 1.25rem;
  }
  .action-item svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .user-avatar {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
  .search-container input {
    padding: 0.85rem 3rem 0.85rem 1.25rem;
    font-size: 0.95rem;
    border-radius: 999px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }
  .search-btn {
    right: 0.5rem;
    padding: 0.6rem;
  }
  .search-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .cart-badge {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
  }
}

/* 📟 Tablets / iPad (telas de 768px até 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Estilos específicos para iPad e tablets parecidos */
  .container {
    padding: 0 1.5rem;
  }
  .header-content {
    padding: 1.25rem 0;
  }
  .header-grid {
    gap: 1.5rem;
  }
  .logo-image {
    height: 2.75rem;
  }
  .user-actions {
    gap: 1.5rem;
  }
  .action-item svg {
    width: 1.6rem;
    height: 1.6rem;
  }
  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 0.95rem;
  }
  .search-container input {
    padding: 0.85rem 3rem 0.85rem 1.5rem;
    font-size: 1rem;
    border-radius: 999px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }
  .search-btn {
    right: 0.75rem;
    padding: 0.6rem;
  }
  .search-btn svg {
    width: 1.35rem;
    height: 1.35rem;
  }
  .cart-badge {
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
  }
}

/* 💻 Notebooks / Telas médias (telas de 992px até 1199px) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Estilos para notebooks e monitores menores */
  .container {
    padding: 0 1.5rem;
  }
  .header-content {
    padding: 1rem 0;
  }
  .header-grid {
    gap: 2rem;
    flex-wrap: nowrap;
  }
  .search-container {
    flex: 1;
    max-width: 500px;
    order: 0;
    margin-top: 0;
  }
  .logo-image {
    height: 3rem;
  }
  .user-actions {
    gap: 1.25rem;
    order: 0;
    margin-left: 0;
  }
  .action-item svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .action-item {
    font-size: 0.85rem;
    gap: 0.4rem;
  }
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.85rem;
  }
  .user-btn {
    padding: 0.3rem 0.6rem 0.3rem 0.3rem;
    gap: 0.5rem;
  }
  .search-container input {
    padding: 0.7rem 2.5rem 0.7rem 1.25rem;
    font-size: 0.95rem;
    border-radius: 999px;
  }
  .search-btn {
    right: 0.5rem;
  }
  .search-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .cart-badge {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
  }
  .nav-grid {
    gap: 1.5rem;
    padding: 0;
  }
  .categories-btn {
    font-size: 0.85rem;
    padding: 0.75rem 0;
  }
  .categories-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .nav-links {
    gap: 1.5rem;
  }
  .nav-link {
    font-size: 0.85rem;
    padding: 0.75rem 0;
  }
  .nav-link svg {
    width: 1.1rem;
    height: 1.1rem;
  }
  .dropdown-icon {
    width: 1rem !important;
    height: 1rem !important;
  }
}

/* 🖥️ Computadores / Monitores grandes (telas acima de 1200px) */
@media (min-width: 1200px) {
  /* Estilos para computadores de mesa */
  .container {
    padding: 0 1.5rem;
  }
  .header-content {
    padding: 1rem 0;
  }
  .header-grid {
    gap: 3rem;
    flex-wrap: nowrap;
  }
  .search-container {
    flex: 1;
    max-width: 650px;
    order: 0;
    margin-top: 0;
  }
  .logo-image {
    height: 3.5rem;
  }
  .user-actions {
    gap: 1.5rem;
    order: 0;
    margin-left: 0;
  }
  .action-item svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .action-item {
    font-size: 0.9rem;
    gap: 0.5rem;
  }
  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  .user-btn {
    padding: 0.3rem 0.75rem 0.3rem 0.3rem;
    gap: 0.5rem;
  }
  .search-container input {
    padding: 0.75rem 3rem 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 999px;
  }
  .search-btn {
    right: 0.5rem;
  }
  .search-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .cart-badge {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
  }
  .nav-grid {
    gap: 2rem;
    padding: 0;
  }
  .categories-btn {
    font-size: 0.9rem;
    padding: 1rem 0;
  }
  .categories-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .nav-links {
    gap: 2rem;
  }
  .nav-link {
    font-size: 0.9rem;
    padding: 1rem 0;
  }
  .nav-link svg {
    width: 1.2rem;
    height: 1.2rem;
  }
  .dropdown-icon {
    width: 1rem !important;
    height: 1rem !important;
  }
}
</style>