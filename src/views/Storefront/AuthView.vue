<template>
  <div class="auth-layout">
    <div class="auth-card" v-animate>
      <div class="auth-banner">
        <div class="banner-content">
          <router-link to="/" class="banner-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <div class="brand-text">
              <span class="logo-dls">DLS</span>
              <span class="logo-auto">AUTO PEÇAS</span>
            </div>
          </router-link>
          
          <div class="banner-text">
            <h2>{{ isLoginMode ? 'Bem-vindo de volta!' : 'Junte-se a nós!' }}</h2>
            <p>{{ isLoginMode 
              ? 'Acesse sua conta para gerenciar seus pedidos, ver preços exclusivos e acompanhar suas entregas.' 
              : 'Crie sua conta em segundos e tenha acesso ao maior catálogo de peças diesel do Brasil.' 
            }}</p>
          </div>
          
          <div class="banner-footer">
            <span>Especialistas em Linha Pesada</span>
          </div>
        </div>
      </div>

      <div class="auth-form-container">
        <div class="form-header">
          <h2>{{ isLoginMode ? 'Acessar Conta' : 'Criar Conta' }}</h2>
          <p>{{ isLoginMode ? 'Insira seus dados para continuar' : 'Preencha os dados abaixo' }}</p>
        </div>

        <div v-if="authStore.error" class="error-alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="input-group" v-if="!isLoginMode">
            <label for="name">Nome Completo</label>
            <input type="text" id="name" v-model="formData.name" placeholder="Ex: João da Silva" :required="!isLoginMode">
          </div>

          <div class="input-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" v-model="formData.email" placeholder="seu@email.com" required>
          </div>

          <div class="input-group">
            <div class="label-row">
              <label for="password">Senha</label>
              <a href="#" v-if="isLoginMode" class="forgot-password">Esqueceu a senha?</a>
            </div>
            <input type="password" id="password" v-model="formData.password" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn-primary" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner"></span>
            <span v-else>{{ isLoginMode ? 'Entrar' : 'Cadastrar' }}</span>
          </button>
        </form>

        <div class="form-footer">
          <p v-if="isLoginMode">
            Ainda não tem conta? 
            <button class="toggle-btn" @click="toggleMode">Crie uma agora</button>
          </p>
          <p v-else>
            Já possui uma conta? 
            <button class="toggle-btn" @click="toggleMode">Faça login</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isLoginMode = ref(true)

const formData = reactive({
  name: '',
  email: '',
  password: ''
})

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  authStore.error = null
  formData.name = ''
  formData.password = ''
}

const handleSubmit = async () => {
  let success = false
  
  if (isLoginMode.value) {
    success = await authStore.login(formData.email, formData.password)
  } else {
    success = await authStore.register(formData.name, formData.email, formData.password)
  }

  if (success) {
    if (authStore.isSuperuser) {
      router.push('/admin/produtos')
    } else {
      router.push('/')
    }
  }
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  padding: 2rem 1.5rem;
}

.auth-card {
  width: 100%;
  max-width: 1000px;
  background-color: var(--surface-color);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

@media (min-width: 992px) {
  .auth-card {
    flex-direction: row;
    height: 600px;
  }
}

.auth-banner {
  background: linear-gradient(135deg, #00361c 0%, #008f4c 100%);
  color: #ffffff;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

@media (min-width: 992px) {
  .auth-banner {
    width: 45%;
  }
}

.auth-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
  transform: rotate(30deg);
  pointer-events: none;
}

.banner-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.banner-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #ffffff;
  margin-bottom: auto;
}

.banner-logo svg {
  width: 2.5rem;
  height: 2.5rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-dls {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.logo-auto {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.banner-text {
  margin: 3rem 0;
}

.banner-text h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.banner-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.banner-footer {
  margin-top: auto;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.7;
}

.auth-form-container {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (min-width: 992px) {
  .auth-form-container {
    width: 55%;
    padding: 4rem;
  }
}

.form-header {
  margin-bottom: 2.5rem;
}

.form-header h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
  font-weight: 800;
}

.form-header p {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0;
}

.error-alert {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.error-alert svg {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}

.forgot-password {
  font-size: 0.85rem;
  color: var(--primary-light);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.forgot-password:hover {
  opacity: 0.8;
}

.input-group input {
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  font-size: 1rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  transition: all 0.2s ease;
  outline: none;
}

.input-group input:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(0, 168, 89, 0.1);
}

.btn-primary {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 1.125rem;
  border-radius: 0.75rem;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 54px;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--primary-light);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
}

.toggle-btn:hover {
  text-decoration: underline;
}
</style>