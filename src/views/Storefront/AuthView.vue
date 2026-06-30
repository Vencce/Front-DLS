<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isLoginMode = ref(true)
const localError = ref('')

const formData = reactive({
  name: '',
  username: '',
  email: '',
  password: ''
})

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  authStore.error = null
  localError.value = ''
  formData.name = ''
  formData.username = ''
  formData.email = ''
  formData.password = ''
}

const handleGoogleLogin = () => {
  alert('A integração completa com o Google requer configuração no backend (OAuth2).')
}

const handleSubmit = async () => {
  localError.value = ''
  
  if (!isLoginMode.value && !validateEmail(formData.email)) {
    localError.value = 'Por favor, insira um endereço de e-mail válido.'
    return
  }

  if (isLoginMode.value && formData.username.includes('@') && !validateEmail(formData.username)) {
    localError.value = 'O formato do e-mail inserido é inválido.'
    return
  }

  let success = false
  
  if (isLoginMode.value) {
    success = await authStore.login(formData.username, formData.password)
  } else {
    success = await authStore.register(formData.name, formData.username, formData.email, formData.password)
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
              ? 'Acesse sua conta para gerenciar seus pedidos.' 
              : 'Crie sua conta e acesse nosso catálogo.' 
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

        <button class="btn-social google-btn" @click="handleGoogleLogin" type="button">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continuar com o Google
        </button>

        <div class="divider">
          <span>ou continue com</span>
        </div>

        <div v-if="localError || authStore.error" class="error-alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ localError || authStore.error }}
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form" novalidate>
          <div class="input-row" v-if="!isLoginMode">
            <div class="input-group">
              <label for="name">Nome Completo</label>
              <input type="text" id="name" v-model="formData.name" placeholder="Ex: João Silva" :required="!isLoginMode">
            </div>
            <div class="input-group">
              <label for="username">Nome de Usuário</label>
              <input type="text" id="username" v-model="formData.username" placeholder="joaosilva" :required="!isLoginMode">
            </div>
          </div>

          <div class="input-group" v-if="!isLoginMode">
            <label for="email">E-mail</label>
            <input type="email" id="email" v-model="formData.email" placeholder="seu@email.com" :required="!isLoginMode">
          </div>

          <div class="input-group" v-if="isLoginMode">
            <label for="loginIdentifier">Nome de Usuário ou E-mail</label>
            <input type="text" id="loginIdentifier" v-model="formData.username" placeholder="joaosilva ou seu@email.com" required>
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
            <button class="toggle-btn" type="button" @click="toggleMode">Crie uma agora</button>
          </p>
          <p v-else>
            Já possui conta? 
            <button class="toggle-btn" type="button" @click="toggleMode">Faça login</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  background-color: var(--bg-color);
}

.auth-card {
  width: 100%;
  max-width: 900px;
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
    min-height: 550px;
  }
}

.auth-banner {
  background: linear-gradient(135deg, #00361c 0%, #008f4c 100%);
  color: #ffffff;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

@media (min-width: 992px) {
  .auth-banner {
    width: 45%;
    padding: 2.5rem;
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
  margin-bottom: 1.5rem;
}

@media (min-width: 992px) {
  .banner-logo {
    margin-bottom: auto;
  }
}

.banner-logo svg {
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
  letter-spacing: 2px;
}

.banner-text {
  margin: 1rem 0;
}

@media (min-width: 992px) {
  .banner-text {
    margin: 2rem 0;
  }
}

.banner-text h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

@media (min-width: 992px) {
  .banner-text h2 {
    font-size: 2rem;
    margin: 0 0 0.75rem 0;
  }
}

.banner-text p {
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.9;
}

.banner-footer {
  margin-top: 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.7;
}

@media (min-width: 992px) {
  .banner-footer {
    margin-top: auto;
  }
}

.auth-form-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}

@media (min-width: 992px) {
  .auth-form-container {
    width: 55%;
    padding: 2rem 2.5rem;
  }
}

.form-header {
  margin-bottom: 1.25rem;
}

.form-header h2 {
  font-size: 1.25rem;
  color: var(--text-main);
  margin: 0 0 0.25rem 0;
  font-weight: 800;
}

@media (min-width: 992px) {
  .form-header h2 {
    font-size: 1.5rem;
  }
}

.form-header p {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
}

.btn-social {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--surface-color);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.btn-social:hover {
  background-color: var(--surface-hover);
  border-color: var(--text-muted);
}

.btn-social svg {
  width: 1.15rem;
  height: 1.15rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 0.75rem;
}

.error-alert {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.error-alert svg {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

@media (min-width: 640px) {
  .input-row {
    flex-direction: row;
  }
  .input-row .input-group {
    flex: 1;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-main);
}

.forgot-password {
  font-size: 0.7rem;
  color: var(--primary-light);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.forgot-password:hover {
  opacity: 0.8;
}

.input-group input {
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.85rem;
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
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 42px;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 5px 10px -3px rgba(0, 168, 89, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--primary-light);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
}

.toggle-btn:hover {
  text-decoration: underline;
}
</style>