<script setup>
import { RouterView } from 'vue-router'
import StoreHeader from '../components/storefront/StoreHeader.vue'
import StoreFooter from '../components/storefront/StoreFooter.vue'
</script>

<template>
  <div class="layout-wrapper">
    <StoreHeader />

    <main class="main-content">
      <router-view />
    </main>

    <StoreFooter />
  </div>
</template>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  font-family: sans-serif;
}

.main-content {
  flex-grow: 1;
}
</style>