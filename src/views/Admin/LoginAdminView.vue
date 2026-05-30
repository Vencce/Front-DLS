<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="brand-logo">
          <span class="logo-dls">DLS</span> <span class="logo-text">ADMIN</span>
        </div>
        <p>Acesso restrito ao Painel de Gestão</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>
        <div class="form-group">
          <label for="email">E-mail / Usuário</label>
          <input type="text" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" class="login-btn" :disabled="authStore.loading">
          {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      <div class="login-footer">
        <router-link to="/">Voltar para a loja</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/admin/dashboard')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
  background-image: radial-gradient(circle at center, #e6f4ea 0%, #f9fafb 100%);
}

.login-container {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  background-color: #004d28;
  padding: 2.5rem 2rem;
  text-align: center;
}

.brand-logo {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.logo-dls {
  color: #ffffff;
  font-style: italic;
}

.logo-text {
  color: #00a859;
}

.login-header p {
  color: #e6f4ea;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
}

.login-form {
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-group input {
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  background-color: #f9fafb;
}

.form-group input:focus {
  border-color: #00a859;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 168, 89, 0.1);
}

.login-btn {
  background-color: #00a859;
  color: #ffffff;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 800;
  font-size: 1.125rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.login-btn:hover:not(:disabled) {
  background-color: #008f4c;
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(0, 168, 89, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
}

.login-footer a {
  color: #6b7280;
  font-size: 0.95rem;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-footer a:hover {
  color: #004d28;
}
</style>