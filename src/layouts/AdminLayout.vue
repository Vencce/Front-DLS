<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <span class="admin-brand"><span class="logo-dls">DLS</span> <span class="logo-text">ADMIN</span></span>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-link">Dashboard</router-link>
        <router-link to="/admin/produtos" class="nav-link">Produtos</router-link>
        <router-link to="/admin/pedidos" class="nav-link">Pedidos</router-link>
        <router-link to="/admin/configuracoes" class="nav-link">Configurações</router-link>
      </nav>
      <div class="sidebar-footer">
        <router-link to="/" class="back-to-store">Voltar à Loja</router-link>
      </div>
    </aside>
    
    <main class="admin-main">
      <header class="admin-topbar">
        <div class="topbar-info">
          <span>Painel de Gestão</span>
        </div>
        <div class="topbar-user">
          <button @click="themeStore.toggleTheme" class="theme-toggle">
            <svg v-if="themeStore.theme === 'light'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          <span class="user-name">Administrador</span>
          <button class="logout-btn">Sair</button>
        </div>
      </header>
      
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useThemeStore } from '../stores/themeStore'

const themeStore = useThemeStore()
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  flex-direction: column;
  transition: background-color 0.3s ease;
}

@media (min-width: 768px) {
  .admin-layout {
    flex-direction: row;
  }
}

.admin-sidebar {
  width: 100%;
  background-color: var(--header-bg);
  color: var(--header-text);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.05);
  z-index: 10;
  transition: background-color 0.3s ease;
}

@media (min-width: 768px) {
  .admin-sidebar {
    width: 260px;
    flex-shrink: 0;
    min-height: 100vh;
    position: sticky;
    top: 0;
  }
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

@media (min-width: 768px) {
  .sidebar-header {
    text-align: left;
  }
}

.admin-brand {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.logo-dls {
  color: var(--header-text);
  font-style: italic;
}

.logo-text {
  color: var(--primary-light);
}

.sidebar-nav {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  padding: 1.5rem 1rem;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .sidebar-nav {
    flex-direction: column;
    flex-grow: 1;
  }
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  font-weight: 600;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.2);
  color: #ffffff;
}

.nav-link.router-link-active {
  background-color: var(--primary-light);
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(0, 168, 89, 0.3);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: none;
}

@media (min-width: 768px) {
  .sidebar-footer {
    display: block;
    margin-top: auto;
  }
}

.back-to-store {
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
  font-weight: 500;
}

.back-to-store:hover {
  color: var(--primary-light);
}

.admin-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-topbar {
  background-color: var(--surface-color);
  height: 70px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.topbar-info {
  font-weight: 700;
  color: var(--text-main);
  font-size: 1.125rem;
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.theme-toggle:hover {
  color: var(--primary-light);
}

.action-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.user-name {
  font-size: 0.95rem;
  color: var(--text-muted);
  display: none;
  font-weight: 600;
}

@media (min-width: 640px) {
  .user-name {
    display: block;
  }
}

.logout-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.logout-btn:hover {
  color: #dc2626;
}

.admin-content {
  padding: 2rem;
  flex-grow: 1;
  overflow-y: auto;
}
</style>