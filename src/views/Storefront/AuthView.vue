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
  background-color: var(--bg-color);
  box-sizing: border-box;
}

.auth-card {
  width: 100%;
  background-color: var(--surface-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.auth-banner {
  background: linear-gradient(135deg, #00361c 0%, #008f4c 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
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
  text-decoration: none;
  color: #ffffff;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-dls {
  font-weight: 900;
  letter-spacing: 1px;
}

.logo-auto {
  font-weight: 700;
  letter-spacing: 2px;
}

.banner-text h2 {
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

.banner-text p {
  opacity: 0.9;
  margin: 0;
}

.banner-footer {
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.7;
}

.auth-form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  box-sizing: border-box;
}

.mode-toggle {
  display: flex;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
}

.mode-toggle button {
  flex: 1;
  border: none;
  background: none;
  font-weight: 800;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0.75rem;
}

.mode-toggle button.active {
  background-color: var(--primary-light);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 143, 76, 0.3);
}

.google-login-wrapper {
  display: flex;
  justify-content: center;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-muted);
  font-weight: 600;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.error-alert {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  display: flex;
  align-items: center;
  font-weight: 700;
}

.error-alert svg {
  flex-shrink: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 800;
  color: var(--text-main);
}

.input-group input {
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-main);
  transition: all 0.2s ease;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 4px rgba(0, 168, 89, 0.15);
}

.btn-primary {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(0, 168, 89, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 575.98px) {
  /* Estilos para smartphones pequenos e médios */
  .auth-layout {
    padding: 1.5rem 1rem 3rem 1rem;
    min-height: calc(100vh - 80px);
  }
  .auth-card {
    border-radius: 1.25rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--border-color);
  }
  .auth-banner {
    padding: 1.5rem;
    text-align: center;
    align-items: center;
  }
  .banner-logo {
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    justify-content: center;
  }
  .banner-logo svg {
    width: 2rem;
    height: 2rem;
  }
  .logo-dls {
    font-size: 1.2rem;
  }
  .logo-auto {
    font-size: 0.7rem;
  }
  .banner-text {
    margin: 0.5rem 0 1.25rem 0;
  }
  .banner-text h2 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }
  .banner-text p {
    font-size: 0.95rem;
    line-height: 1.4;
  }
  .banner-footer {
    margin-top: 0;
    font-size: 0.7rem;
  }
  .auth-form-container {
    padding: 1.75rem 1.25rem;
  }
  .mode-toggle {
    padding: 0.35rem;
    margin-bottom: 1.75rem;
  }
  .mode-toggle button {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  .google-login-wrapper {
    margin-bottom: 1.5rem;
  }
  .divider {
    margin-bottom: 1.5rem;
    font-size: 0.85rem;
  }
  .divider span {
    padding: 0 1rem;
  }
  .error-alert {
    padding: 0.85rem 1rem;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
    gap: 0.75rem;
    font-size: 0.9rem;
  }
  .error-alert svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .auth-form {
    gap: 1.25rem;
  }
  .input-group {
    gap: 0.5rem;
  }
  .input-group label {
    font-size: 0.9rem;
  }
  .input-group input {
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    font-size: 1rem; /* Evita zoom no iOS */
  }
  .btn-primary {
    padding: 1.1rem;
    border-radius: 0.75rem;
    font-size: 1.05rem;
    margin-top: 0.5rem;
    min-height: 54px;
  }
  .spinner {
    width: 22px;
    height: 22px;
  }
}

/* 📱 Celulares grandes / modo paisagem (telas de 576px até 767px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Estilos para smartphones maiores */
  .auth-layout {
    padding: 2.5rem 1.5rem 4rem 1.5rem;
  }
  .auth-card {
    max-width: 500px;
    margin: 0 auto;
    border-radius: 1.5rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
  }
  .auth-banner {
    padding: 2rem;
    text-align: center;
    align-items: center;
  }
  .banner-logo {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    justify-content: center;
  }
  .banner-logo svg {
    width: 2.25rem;
    height: 2.25rem;
  }
  .logo-dls {
    font-size: 1.35rem;
  }
  .logo-auto {
    font-size: 0.8rem;
  }
  .banner-text {
    margin: 0.5rem 0 1.5rem 0;
  }
  .banner-text h2 {
    font-size: 1.6rem;
    margin-bottom: 0.6rem;
  }
  .banner-text p {
    font-size: 1rem;
    line-height: 1.5;
  }
  .banner-footer {
    margin-top: 0;
    font-size: 0.75rem;
  }
  .auth-form-container {
    padding: 2rem 2.5rem;
  }
  .mode-toggle {
    padding: 0.35rem;
    margin-bottom: 2rem;
  }
  .mode-toggle button {
    padding: 0.85rem;
    font-size: 0.95rem;
  }
  .google-login-wrapper {
    margin-bottom: 1.75rem;
  }
  .divider {
    margin-bottom: 1.75rem;
    font-size: 0.9rem;
  }
  .divider span {
    padding: 0 1.25rem;
  }
  .error-alert {
    padding: 1rem;
    border-radius: 0.75rem;
    margin-bottom: 1.75rem;
    gap: 0.75rem;
    font-size: 0.95rem;
  }
  .error-alert svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .auth-form {
    gap: 1.5rem;
  }
  .input-group {
    gap: 0.5rem;
  }
  .input-group label {
    font-size: 0.95rem;
  }
  .input-group input {
    padding: 1.1rem 1.25rem;
    border-radius: 0.75rem;
    font-size: 1rem;
  }
  .btn-primary {
    padding: 1.15rem;
    border-radius: 0.75rem;
    font-size: 1.1rem;
    margin-top: 0.5rem;
    min-height: 56px;
  }
  .spinner {
    width: 24px;
    height: 24px;
  }
}

/* 📟 Tablets / iPad (telas de 768px até 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Estilos específicos para iPad e tablets parecidos */
  .auth-layout {
    padding: 4rem 2rem 5rem 2rem;
  }
  .auth-card {
    max-width: 600px;
    margin: 0 auto;
    border-radius: 1.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border: 1px solid var(--border-color);
  }
  .auth-banner {
    padding: 2.5rem;
    text-align: center;
    align-items: center;
  }
  .banner-logo {
    gap: 0.75rem;
    margin-bottom: 1.75rem;
    justify-content: center;
  }
  .banner-logo svg {
    width: 2.5rem;
    height: 2.5rem;
  }
  .logo-dls {
    font-size: 1.5rem;
  }
  .logo-auto {
    font-size: 0.85rem;
  }
  .banner-text {
    margin: 0.5rem 0 1.75rem 0;
  }
  .banner-text h2 {
    font-size: 1.85rem;
    margin-bottom: 0.75rem;
  }
  .banner-text p {
    font-size: 1.05rem;
    line-height: 1.6;
  }
  .banner-footer {
    margin-top: 0;
    font-size: 0.8rem;
  }
  .auth-form-container {
    padding: 2.5rem 3.5rem;
  }
  .mode-toggle {
    padding: 0.4rem;
    margin-bottom: 2.25rem;
  }
  .mode-toggle button {
    padding: 0.9rem;
    font-size: 1rem;
  }
  .google-login-wrapper {
    margin-bottom: 2rem;
  }
  .divider {
    margin-bottom: 2rem;
    font-size: 0.95rem;
  }
  .divider span {
    padding: 0 1.5rem;
  }
  .error-alert {
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    gap: 0.75rem;
    font-size: 0.95rem;
  }
  .error-alert svg {
    width: 1.35rem;
    height: 1.35rem;
  }
  .auth-form {
    gap: 1.5rem;
  }
  .input-group {
    gap: 0.6rem;
  }
  .input-group label {
    font-size: 1rem;
  }
  .input-group input {
    padding: 1.15rem 1.5rem;
    border-radius: 0.75rem;
    font-size: 1.05rem;
  }
  .btn-primary {
    padding: 1.25rem;
    border-radius: 0.75rem;
    font-size: 1.15rem;
    margin-top: 1rem;
    min-height: 60px;
  }
  .spinner {
    width: 26px;
    height: 26px;
  }
}

/* 💻 Notebooks / Telas médias (telas de 992px até 1199px) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Estilos para notebooks e monitores menores */
  .auth-layout {
    padding: 5rem 2rem;
  }
  .auth-card {
    max-width: 900px;
    margin: 0 auto;
    flex-direction: row;
    min-height: 600px;
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    border: 1px solid var(--border-color);
  }
  .auth-banner {
    width: 45%;
    padding: 3rem 2.5rem;
  }
  .banner-logo {
    gap: 0.75rem;
    margin-bottom: auto;
  }
  .banner-logo svg {
    width: 2.25rem;
    height: 2.25rem;
  }
  .logo-dls {
    font-size: 1.4rem;
  }
  .logo-auto {
    font-size: 0.85rem;
  }
  .banner-text {
    margin: 2rem 0;
  }
  .banner-text h2 {
    font-size: 1.85rem;
    margin-bottom: 1rem;
  }
  .banner-text p {
    font-size: 1.05rem;
    line-height: 1.6;
  }
  .banner-footer {
    margin-top: auto;
    font-size: 0.85rem;
  }
  .auth-form-container {
    width: 55%;
    padding: 3rem;
  }
  .mode-toggle {
    padding: 0.4rem;
    margin-bottom: 2rem;
  }
  .mode-toggle button {
    padding: 0.9rem;
    font-size: 1rem;
  }
  .google-login-wrapper {
    margin-bottom: 2rem;
  }
  .divider {
    margin-bottom: 2rem;
    font-size: 0.9rem;
  }
  .divider span {
    padding: 0 1.25rem;
  }
  .error-alert {
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    gap: 0.75rem;
    font-size: 0.95rem;
  }
  .error-alert svg {
    width: 1.35rem;
    height: 1.35rem;
  }
  .auth-form {
    gap: 1.5rem;
  }
  .input-group {
    gap: 0.6rem;
  }
  .input-group label {
    font-size: 0.95rem;
  }
  .input-group input {
    padding: 1.15rem 1.5rem;
    border-radius: 0.75rem;
    font-size: 1.05rem;
  }
  .btn-primary {
    padding: 1.25rem;
    border-radius: 0.75rem;
    font-size: 1.1rem;
    margin-top: 1rem;
    min-height: 56px;
  }
  .spinner {
    width: 24px;
    height: 24px;
  }
}

/* 🖥️ Computadores / Monitores grandes (telas acima de 1200px) */
@media (min-width: 1200px) {
  /* Estilos para computadores de mesa */
  .auth-layout {
    padding: 6rem 2rem;
  }
  .auth-card {
    max-width: 1000px;
    margin: 0 auto;
    flex-direction: row;
    min-height: 650px;
    border-radius: 1.75rem;
    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color);
  }
  .auth-banner {
    width: 45%;
    padding: 4rem 3rem;
  }
  .banner-logo {
    gap: 1rem;
    margin-bottom: auto;
  }
  .banner-logo svg {
    width: 2.75rem;
    height: 2.75rem;
  }
  .logo-dls {
    font-size: 1.75rem;
  }
  .logo-auto {
    font-size: 0.95rem;
  }
  .banner-text {
    margin: 3rem 0;
  }
  .banner-text h2 {
    font-size: 2.25rem;
    margin-bottom: 1.25rem;
  }
  .banner-text p {
    font-size: 1.15rem;
    line-height: 1.7;
  }
  .banner-footer {
    margin-top: auto;
    font-size: 0.9rem;
  }
  .auth-form-container {
    width: 55%;
    padding: 4rem;
  }
  .mode-toggle {
    padding: 0.5rem;
    margin-bottom: 2.5rem;
  }
  .mode-toggle button {
    padding: 1rem;
    font-size: 1.05rem;
  }
  .google-login-wrapper {
    margin-bottom: 2.5rem;
  }
  .divider {
    margin-bottom: 2.5rem;
    font-size: 0.95rem;
  }
  .divider span {
    padding: 0 1.5rem;
  }
  .error-alert {
    padding: 1.25rem 1.5rem;
    border-radius: 0.75rem;
    margin-bottom: 2.5rem;
    gap: 1rem;
    font-size: 1rem;
  }
  .error-alert svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .auth-form {
    gap: 1.75rem;
  }
  .input-group {
    gap: 0.75rem;
  }
  .input-group label {
    font-size: 1rem;
  }
  .input-group input {
    padding: 1.25rem 1.5rem;
    border-radius: 0.75rem;
    font-size: 1.05rem;
  }
  .btn-primary {
    padding: 1.35rem;
    border-radius: 0.75rem;
    font-size: 1.15rem;
    margin-top: 1.25rem;
    min-height: 60px;
  }
  .spinner {
    width: 26px;
    height: 26px;
  }
}
</style>