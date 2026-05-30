<template>
  <div id="app">
    <StoreHeader v-if="isStorefront" />
    <MiniCart v-if="isStorefront" />
    
    <main class="main-content">
      <router-view />
    </main>
    <StoreFooter v-if="isStorefront" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from './stores/themeStore'
import { useAuthStore } from './stores/authStore'
import StoreHeader from './components/storefront/StoreHeader.vue'
import MiniCart from './components/storefront/MiniCart.vue'
import StoreFooter from './components/storefront/StoreFooter.vue'

const route = useRoute()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const isStorefront = computed(() => {
  return !route.path.startsWith('/admin')
})

onMounted(() => {
  themeStore.initTheme()
  authStore.initAuth()
})
</script>

<style>
@import './assets/main.css';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-main);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.main-content {
  flex-grow: 1;
}
</style>