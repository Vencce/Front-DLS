<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleLogin } from 'vue3-google-login'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const mode = ref('login') // 'login' | 'register'
const localError = ref('')

const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ name: '', email: '', password: '', confirmPassword: '' })

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const switchMode = (newMode) => {
  mode.value = newMode
  localError.value = ''
  authStore.error = null
}

const handleGoogleCallback = async (response) => {
  try {
    await authStore.loginWithGoogle(response.credential)
    router.push('/')
  } catch (err) {
    // authStore.error já fica exposto e é mostrado no template
  }
}

const handleLoginSubmit = async () => {
  localError.value = ''
  if (!validateEmail(loginForm.email)) {
    localError.value = 'Insira um e-mail válido.'
    return
  }
  try {
    await authStore.login({ username: loginForm.email, password: loginForm.password })
    router.push('/')
  } catch (err) {
    // authStore.error já fica exposto e é mostrado no template
  }
}

const handleRegisterSubmit = async () => {
  localError.value = ''
  if (!registerForm.name.trim()) {
    localError.value = 'Informe seu nome completo.'
    return
  }
  if (!validateEmail(registerForm.email)) {
    localError.value = 'Insira um e-mail válido.'
    return
  }
  if (registerForm.password.length < 8) {
    localError.value = 'A senha precisa ter pelo menos 8 caracteres.'
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    localError.value = 'As senhas não coincidem.'
    return
  }
  try {
    await authStore.register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
    })
    router.push('/')
  } catch (err) {
    // authStore.error já fica exposto e é mostrado no template
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
            <h2>{{ mode === 'login' ? 'Que bom te ver de novo' : 'Bem-vindo à família DLS' }}</h2>
            <p>{{ mode === 'login'
              ? 'Acesse sua conta para acompanhar pedidos, endereços e muito mais.'
              : 'Crie sua conta para comprar mais rápido e acompanhar seus pedidos.' }}</p>
          </div>

          <div class="banner-footer">
            <span>Especialistas em Linha Pesada</span>
          </div>
        </div>
      </div>

      <div class="auth-form-container">
        <div class="mode-toggle">
          <button
            type="button"
            :class="{ active: mode === 'login' }"
            @click="switchMode('login')"
          >Entrar</button>
          <button
            type="button"
            :class="{ active: mode === 'register' }"
            @click="switchMode('register')"
          >Criar Conta</button>
        </div>

        <div class="google-login-wrapper">
          <GoogleLogin :callback="handleGoogleCallback" />
        </div>

        <div class="divider">
          <span>ou continue com e-mail</span>
        </div>

        <div v-if="localError || authStore.error" class="error-alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ localError || authStore.error }}
        </div>

        <form v-if="mode === 'login'" @submit.prevent="handleLoginSubmit" class="auth-form" novalidate>
          <div class="input-group">
            <label for="loginEmail">E-mail</label>
            <input type="email" id="loginEmail" v-model="loginForm.email" placeholder="seu@email.com" required>
          </div>

          <div class="input-group">
            <label for="loginPassword">Senha</label>
            <input type="password" id="loginPassword" v-model="loginForm.password" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn-primary" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner"></span>
            <span v-else>Entrar</span>
          </button>
        </form>

        <form v-else @submit.prevent="handleRegisterSubmit" class="auth-form" novalidate>
          <div class="input-group">
            <label for="registerName">Nome Completo</label>
            <input type="text" id="registerName" v-model="registerForm.name" placeholder="Seu nome completo" required>
          </div>

          <div class="input-group">
            <label for="registerEmail">E-mail</label>
            <input type="email" id="registerEmail" v-model="registerForm.email" placeholder="seu@email.com" required>
          </div>

          <div class="input-group">
            <label for="registerPassword">Senha</label>
            <input type="password" id="registerPassword" v-model="registerForm.password" placeholder="Mínimo 8 caracteres" required>
          </div>

          <div class="input-group">
            <label for="registerConfirmPassword">Confirmar Senha</label>
            <input type="password" id="registerConfirmPassword" v-model="registerForm.confirmPassword" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn-primary" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner"></span>
            <span v-else>Criar Conta</span>
          </button>
        </form>
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
    min-height: 620px;
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

.mode-toggle {
  display: flex;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
}

.mode-toggle button {
  flex: 1;
  border: none;
  background: none;
  padding: 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-toggle button.active {
  background-color: var(--primary-light);
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 143, 76, 0.25);
}

.google-login-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
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

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-main);
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
</style>