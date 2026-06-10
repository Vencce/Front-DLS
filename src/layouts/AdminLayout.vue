<template>
  <div class="admin-layout" :class="{ 'sidebar-open': isSidebarOpen }">
    <aside class="sidebar">
      <div class="sidebar-header">
        <router-link to="/admin" class="brand-link">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div class="brand-text">
            <span class="logo-dls">DLS</span>
            <span class="logo-admin">ADMIN</span>
          </div>
        </router-link>
        <button class="close-sidebar" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </router-link>

        <router-link to="/admin/produtos" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Produtos
        </router-link>

        <router-link to="/admin/pedidos" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Pedidos
        </router-link>

        <router-link to="/admin/clientes" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Clientes
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair do Painel
        </button>
      </div>
    </aside>

    <div class="main-wrapper">
      <header class="topbar">
        <div class="topbar-left">
          <button class="menu-btn" @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <router-link to="/" class="store-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a Loja
          </router-link>
        </div>

        <div class="topbar-right">
          <button class="theme-btn" @click="themeStore.toggleTheme">
            <svg v-if="themeStore.theme === 'light'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          <div class="user-profile">
            <div class="avatar">{{ userInitial }}</div>
            <div class="user-info">
              <span class="user-name">{{ authStore.userName }}</span>
              <span class="user-role">Administrador</span>
            </div>
          </div>
        </div>
      </header>

      <main class="admin-content">
        <router-view></router-view>
      </main>
    </div>

    <div class="sidebar-overlay" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isSidebarOpen = ref(false)

const userInitial = computed(() => {
  return authStore.userName ? authStore.userName.charAt(0).toUpperCase() : 'A'
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background-color: var(--bg-color);
  overflow: hidden;
}

.sidebar {
  width: 280px;
  background-color: #004d28;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 50;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
}

.admin-layout.sidebar-open .sidebar {
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0);
    position: static;
    box-shadow: none;
  }
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #ffffff;
}

.brand-icon {
  background-color: var(--primary-light);
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon svg {
  width: 1.5rem;
  height: 1.5rem;
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

.logo-admin {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--primary-light);
}

.close-sidebar {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.25rem;
}

@media (min-width: 1024px) {
  .close-sidebar {
    display: none;
  }
}

.close-sidebar svg {
  width: 1.5rem;
  height: 1.5rem;
}

.sidebar-nav {
  flex-grow: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-item svg {
  width: 1.25rem;
  height: 1.25rem;
  opacity: 0.8;
}

.nav-item:hover, .nav-item.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.nav-item.router-link-active {
  border-left: 4px solid var(--primary-light);
}

.nav-item.router-link-active svg {
  color: var(--primary-light);
  opacity: 1;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 0.875rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: #ef4444;
  color: #ffffff;
  border-color: #ef4444;
}

.logout-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.main-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.topbar {
  height: 70px;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 10;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-btn {
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
}

@media (min-width: 1024px) {
  .menu-btn {
    display: none;
  }
}

.menu-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.store-link {
  display: none;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

@media (min-width: 640px) {
  .store-link {
    display: flex;
  }
}

.store-link:hover {
  color: var(--primary-light);
}

.store-link svg {
  width: 1.25rem;
  height: 1.25rem;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.theme-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.theme-btn:hover {
  color: var(--primary-light);
}

.theme-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  border: 2px solid var(--primary-light);
}

.user-info {
  display: none;
  flex-direction: column;
}

@media (min-width: 640px) {
  .user-info {
    display: flex;
  }
}

.user-name {
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.9rem;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.admin-content {
  flex-grow: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .admin-content {
    padding: 2.5rem;
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.admin-layout.sidebar-open .sidebar-overlay {
  opacity: 1;
  visibility: visible;
}

@media (min-width: 1024px) {
  .sidebar-overlay {
    display: none !important;
  }
}
</style>