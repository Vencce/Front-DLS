<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const orders = ref([])
const isLoading = ref(true)

const activeTab = computed(() => {
  return route.path.includes('meus-pedidos') ? 'orders' : 'profile'
})

const fetchOrders = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/orders/')
    const allOrders = response.data.results || response.data
    
    if (authStore.user && authStore.user.email) {
      const emailUsuarioLogado = authStore.user.email.toLowerCase()
      orders.value = allOrders.filter(o => {
        const emailPedido = (o.customer_email || o.cliente_email || '').toLowerCase()
        return emailPedido === emailUsuarioLogado
      })
    } else {
      orders.value = allOrders
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', month: '2-digit', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  }).format(date)
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
}

const getOrderTotal = (order) => {
  if (order.total_amount) return order.total_amount
  if (order.total) return order.total
  
  let total = Number(order.shipping_fee || 0)
  
  if (order.items && order.items.length > 0) {
    order.items.forEach(item => {
      total += Number(item.quantity) * Number(item.unit_price || item.price || 0)
    })
  }
  return total
}

const getStatusClass = (status) => {
  const s = String(status).toLowerCase()
  if (s === 'paid' || s === 'pago' || s === 'confirmed') return 'status-paid'
  if (s === 'shipped' || s === 'enviado') return 'status-shipped'
  if (s === 'delivered' || s === 'entregue') return 'status-delivered'
  if (s === 'canceled' || s === 'cancelado') return 'status-canceled'
  return 'status-pending'
}

const getStatusName = (status) => {
  const s = String(status).toLowerCase()
  if (s === 'paid' || s === 'pago' || s === 'confirmed') return 'Pago'
  if (s === 'shipped' || s === 'enviado') return 'Enviado'
  if (s === 'delivered' || s === 'entregue') return 'Entregue'
  if (s === 'canceled' || s === 'cancelado') return 'Cancelado'
  return 'Aguardando Pagamento'
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await fetchOrders()
})
</script>

<template>
  <div class="customer-area-page">
    <div class="page-header">
      <div class="container">
        <h1>Minha Conta</h1>
        <p>Acompanhe seus pedidos e gerencie suas informações</p>
      </div>
    </div>

    <div class="container layout-grid">
      <aside class="sidebar">
        <div class="user-profile-card">
          <div class="avatar">
            {{ (authStore.userName || 'U').charAt(0).toUpperCase() }}
          </div>
          <div class="user-info">
            <h3>{{ authStore.userName || 'Usuário' }}</h3>
            <p>{{ authStore.user?.email || 'Nenhum e-mail vinculado' }}</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button 
            :class="{ active: activeTab === 'orders' }" 
            @click="router.push('/meus-pedidos')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Meus Pedidos
          </button>
          
          <button 
            :class="{ active: activeTab === 'profile' }" 
            @click="router.push('/minha-conta')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Meus Dados
          </button>

          <button class="btn-logout" @click="logout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sair da Conta
          </button>
        </nav>
      </aside>

      <main class="content-area">
        <div v-if="activeTab === 'orders'" class="orders-section">
          <h2>Histórico de Pedidos</h2>
          
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Buscando seus pedidos...</p>
          </div>

          <div v-else-if="orders.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <h3>Você ainda não fez nenhum pedido</h3>
            <p>Navegue pelo nosso catálogo e encontre as melhores peças.</p>
            <button class="btn-primary" @click="router.push('/catalogo')">Ver Catálogo</button>
          </div>

          <div v-else class="orders-list">
            <div class="order-card" v-for="order in orders" :key="order.id">
              <div class="order-header">
                <div class="order-id">
                  <span>Pedido</span>
                  <strong>#{{ String(order.id).split('-')[0].toUpperCase() }}</strong>
                </div>
                <div class="order-date">
                  <span>Data da Compra</span>
                  <strong>{{ formatDate(order.created_at || order.data_criacao || order.date) }}</strong>
                </div>
                <div class="order-total">
                  <span>Valor Total</span>
                  <strong>{{ formatPrice(getOrderTotal(order)) }}</strong>
                </div>
                <div class="order-status">
                  <span class="badge" :class="getStatusClass(order.status)">
                    {{ getStatusName(order.status) }}
                  </span>
                </div>
              </div>
              
              <div class="order-items" v-if="order.items && order.items.length > 0">
                <div class="item-row" v-for="item in order.items" :key="item.id || item.product_name">
                  <div class="item-name">{{ item.product_name || item.produto_nome || 'Peça Automotiva' }}</div>
                  <div class="item-qty">{{ item.quantity }}x</div>
                  <div class="item-price">{{ formatPrice(item.unit_price || item.price) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'profile'" class="profile-section">
          <h2>Meus Dados</h2>
          <div class="profile-card">
            <div class="form-group">
              <label>Nome Completo</label>
              <input type="text" :value="authStore.userName" disabled>
            </div>
            <div class="form-group">
              <label>E-mail</label>
              <input type="email" :value="authStore.user?.email" disabled>
            </div>
            <div class="form-group">
              <label>Nome de Usuário</label>
              <input type="text" :value="authStore.user?.username" disabled>
            </div>
            <p class="help-text">Para alterar seus dados de cadastro, por favor entre em contato com o suporte.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.customer-area-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding-bottom: 5rem;
}

.page-header {
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  padding: 3rem 0;
  margin-bottom: 2.5rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.layout-grid {
  display: grid;
  align-items: start;
}

.sidebar {
  display: flex;
  flex-direction: column;
}

.user-profile-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  display: flex;
  align-items: center;
}

.avatar {
  background-color: var(--primary-light);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
}

.user-info h3 {
  margin: 0 0 0.25rem 0;
  color: var(--text-main);
  font-weight: 700;
}

.user-info p {
  margin: 0;
  color: var(--text-muted);
}

.sidebar-nav {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  display: flex;
}

.sidebar-nav button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-nav button svg {
  color: var(--text-muted);
  transition: color 0.2s;
  flex-shrink: 0;
}

.sidebar-nav button:hover {
  background-color: var(--surface-hover);
}

.sidebar-nav button.active {
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
}

.sidebar-nav button.active svg {
  color: var(--primary-light);
}

.sidebar-nav .btn-logout {
  color: #ef4444;
}

.sidebar-nav .btn-logout:hover {
  background-color: #fef2f2;
}

.sidebar-nav .btn-logout svg {
  color: #ef4444;
}

.content-area h2 {
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 1.5rem 0;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: var(--surface-color);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.spinner {
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-light);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state svg {
  color: var(--border-color);
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
}

.order-header {
  background-color: var(--surface-hover);
  display: grid;
  border-bottom: 1px solid var(--border-color);
}

.order-header > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-header span {
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
}

.order-header strong {
  color: var(--text-main);
  font-weight: 700;
}

.badge {
  border-radius: 999px;
  font-weight: 700;
  display: inline-block;
  text-align: center;
}

.status-pending { background-color: #fef9c3; color: #a16207; }
.status-paid { background-color: #dbeafe; color: #1d4ed8; }
.status-shipped { background-color: #e0e7ff; color: #4338ca; }
.status-delivered { background-color: #d1fae5; color: #047857; }
.status-canceled { background-color: #fee2e2; color: #b91c1c; }

.order-items {
  display: flex;
  flex-direction: column;
}

.item-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.item-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.item-name {
  font-weight: 600;
  color: var(--text-main);
}

.item-qty {
  color: var(--text-muted);
  font-weight: 600;
}

.item-price {
  font-weight: 700;
  color: var(--text-main);
}

.profile-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 700;
  color: var(--text-main);
}

.form-group input {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--surface-hover);
  color: var(--text-main);
  outline: none;
}

.form-group input:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
}

.help-text {
  color: var(--text-muted);
  margin: 0;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 575.98px) {
  /* Estilos para smartphones pequenos e médios */
  .customer-area-page {
    padding-bottom: 3rem;
  }
  .page-header {
    padding: 1.5rem 0;
    margin-bottom: 1.5rem;
  }
  .page-header h1 {
    font-size: 1.5rem;
  }
  .page-header p {
    font-size: 0.9rem;
  }
  .layout-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .sidebar {
    gap: 1rem;
  }
  .user-profile-card {
    padding: 1.25rem;
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  .avatar {
    width: 4rem;
    height: 4rem;
    font-size: 1.75rem;
  }
  .user-info h3 {
    font-size: 1.1rem;
  }
  .user-info p {
    font-size: 0.85rem;
  }
  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem;
    border-radius: 0.75rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .sidebar-nav::-webkit-scrollbar {
    display: none;
  }
  .sidebar-nav button {
    width: auto;
    flex-shrink: 0;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    border-radius: 0.5rem;
  }
  .sidebar-nav button svg {
    width: 1.15rem;
    height: 1.15rem;
  }
  .sidebar-nav .btn-logout {
    margin-top: 0;
    border-top: none;
    border-radius: 0.5rem;
  }
  .content-area h2 {
    font-size: 1.25rem;
  }
  .loading-state, .empty-state {
    padding: 3rem 1.25rem;
  }
  .spinner {
    width: 32px;
    height: 32px;
  }
  .empty-state svg {
    width: 3rem;
    height: 3rem;
  }
  .empty-state h3 {
    font-size: 1.1rem;
  }
  .empty-state p {
    font-size: 0.9rem;
  }
  .btn-primary {
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
  }
  .order-header {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.25rem;
  }
  .order-header span {
    font-size: 0.75rem;
  }
  .order-header strong {
    font-size: 0.95rem;
  }
  .badge {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  .order-items {
    padding: 1.25rem;
    gap: 0.75rem;
  }
  .item-row {
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-bottom: 0.75rem;
  }
  .item-name {
    width: 100%;
    font-size: 0.95rem;
  }
  .item-qty {
    font-size: 0.9rem;
  }
  .item-price {
    margin-left: auto;
    font-size: 0.95rem;
  }
  .profile-card {
    padding: 1.25rem;
    gap: 1.25rem;
  }
  .form-group label {
    font-size: 0.85rem;
  }
  .form-group input {
    padding: 0.85rem 1rem;
    font-size: 1rem; /* Previne zoom no iOS */
  }
  .help-text {
    padding-top: 1.25rem;
    font-size: 0.8rem;
  }
}

/* 📱 Celulares grandes / modo paisagem (telas de 576px até 767px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Estilos para smartphones maiores */
  .customer-area-page {
    padding-bottom: 4rem;
  }
  .page-header {
    padding: 2rem 0;
    margin-bottom: 2rem;
  }
  .page-header h1 {
    font-size: 1.85rem;
  }
  .page-header p {
    font-size: 1rem;
  }
  .layout-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .sidebar {
    gap: 1.25rem;
  }
  .user-profile-card {
    padding: 1.5rem;
    gap: 1.25rem;
  }
  .avatar {
    width: 4.5rem;
    height: 4.5rem;
    font-size: 2rem;
  }
  .user-info h3 {
    font-size: 1.25rem;
  }
  .user-info p {
    font-size: 0.95rem;
  }
  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0.75rem;
    border-radius: 0.75rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .sidebar-nav::-webkit-scrollbar {
    display: none;
  }
  .sidebar-nav button {
    width: auto;
    flex-shrink: 0;
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
    border-radius: 0.5rem;
  }
  .sidebar-nav button svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .sidebar-nav .btn-logout {
    margin-top: 0;
    border-top: none;
    border-radius: 0.5rem;
  }
  .content-area h2 {
    font-size: 1.4rem;
  }
  .loading-state, .empty-state {
    padding: 4rem 2rem;
  }
  .spinner {
    width: 36px;
    height: 36px;
  }
  .empty-state svg {
    width: 3.5rem;
    height: 3.5rem;
  }
  .empty-state h3 {
    font-size: 1.2rem;
  }
  .empty-state p {
    font-size: 0.95rem;
  }
  .order-header {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    padding: 1.5rem;
  }
  .order-header span {
    font-size: 0.8rem;
  }
  .order-header strong {
    font-size: 1rem;
  }
  .badge {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
  }
  .order-items {
    padding: 1.5rem;
    gap: 1rem;
  }
  .item-row {
    flex-wrap: nowrap;
    gap: 1rem;
    padding-bottom: 1rem;
  }
  .item-name {
    font-size: 1rem;
  }
  .item-qty {
    font-size: 0.95rem;
  }
  .item-price {
    font-size: 1rem;
  }
  .profile-card {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  .form-group label {
    font-size: 0.9rem;
  }
  .form-group input {
    padding: 0.9rem 1.1rem;
    font-size: 1rem;
  }
  .help-text {
    padding-top: 1.5rem;
    font-size: 0.85rem;
  }
}

/* 📟 Tablets / iPad (telas de 768px até 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Estilos específicos para iPad e tablets parecidos */
  .customer-area-page {
    padding-bottom: 5rem;
  }
  .page-header {
    padding: 2.5rem 0;
    margin-bottom: 2.5rem;
  }
  .page-header h1 {
    font-size: 2.25rem;
  }
  .page-header p {
    font-size: 1.05rem;
  }
  .layout-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .sidebar {
    gap: 1.5rem;
  }
  .user-profile-card {
    padding: 1.75rem;
    gap: 1.5rem;
  }
  .avatar {
    width: 5rem;
    height: 5rem;
    font-size: 2.25rem;
  }
  .user-info h3 {
    font-size: 1.35rem;
  }
  .user-info p {
    font-size: 1rem;
  }
  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 1rem;
    border-radius: 1rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .sidebar-nav::-webkit-scrollbar {
    display: none;
  }
  .sidebar-nav button {
    width: auto;
    flex-shrink: 0;
    padding: 0.85rem 1.5rem;
    font-size: 1rem;
    border-radius: 0.5rem;
  }
  .sidebar-nav button svg {
    width: 1.35rem;
    height: 1.35rem;
  }
  .sidebar-nav .btn-logout {
    margin-top: 0;
    border-top: none;
    border-radius: 0.5rem;
  }
  .content-area h2 {
    font-size: 1.65rem;
  }
  .loading-state, .empty-state {
    padding: 5rem 3rem;
  }
  .order-header {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    padding: 1.75rem;
  }
  .order-items {
    padding: 1.75rem;
    gap: 1.25rem;
  }
  .item-row {
    flex-wrap: nowrap;
    gap: 1.25rem;
    padding-bottom: 1.25rem;
  }
  .profile-card {
    padding: 2rem;
    gap: 1.75rem;
  }
  .form-group label {
    font-size: 0.95rem;
  }
  .form-group input {
    padding: 1rem 1.25rem;
    font-size: 1.05rem;
  }
  .help-text {
    padding-top: 1.75rem;
    font-size: 0.9rem;
  }
}

/* 💻 Notebooks / Telas médias (telas de 992px até 1199px) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Estilos para notebooks e monitores menores */
  .customer-area-page {
    padding-bottom: 5rem;
  }
  .page-header {
    padding: 3rem 0;
    margin-bottom: 3rem;
  }
  .page-header h1 {
    font-size: 2.5rem;
  }
  .page-header p {
    font-size: 1.1rem;
  }
  .layout-grid {
    grid-template-columns: 280px 1fr;
    gap: 2.5rem;
  }
  .sidebar {
    gap: 1.5rem;
  }
  .user-profile-card {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  .avatar {
    width: 4.5rem;
    height: 4.5rem;
    font-size: 2rem;
  }
  .sidebar-nav {
    flex-direction: column;
    padding: 1rem;
    border-radius: 1rem;
  }
  .sidebar-nav button {
    padding: 1rem;
    font-size: 0.95rem;
    border-radius: 0.5rem;
    width: 100%;
  }
  .sidebar-nav .btn-logout {
    margin-top: 1rem;
    border-top: 1px solid var(--border-color);
    border-radius: 0;
  }
  .order-header {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    padding: 1.5rem;
  }
  .order-items {
    padding: 1.5rem;
    gap: 1rem;
  }
  .profile-card {
    padding: 2rem;
    gap: 1.5rem;
  }
}

/* 🖥️ Computadores / Monitores grandes (telas acima de 1200px) */
@media (min-width: 1200px) {
  /* Estilos para computadores de mesa */
  .customer-area-page {
    padding-bottom: 6rem;
  }
  .page-header {
    padding: 3.5rem 0;
    margin-bottom: 3.5rem;
  }
  .page-header h1 {
    font-size: 2.75rem;
  }
  .page-header p {
    font-size: 1.15rem;
  }
  .layout-grid {
    grid-template-columns: 320px 1fr;
    gap: 3rem;
  }
  .sidebar {
    gap: 2rem;
  }
  .user-profile-card {
    padding: 2rem;
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
  }
  .avatar {
    width: 5rem;
    height: 5rem;
    font-size: 2.25rem;
  }
  .sidebar-nav {
    flex-direction: column;
    padding: 1.25rem;
    border-radius: 1.25rem;
  }
  .sidebar-nav button {
    padding: 1.15rem;
    font-size: 1.05rem;
    border-radius: 0.6rem;
    width: 100%;
  }
  .sidebar-nav .btn-logout {
    margin-top: 1.25rem;
    border-top: 1px solid var(--border-color);
    border-radius: 0;
  }
  .order-header {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    padding: 1.75rem;
  }
  .order-items {
    padding: 1.75rem;
    gap: 1.25rem;
  }
  .profile-card {
    padding: 2.5rem;
    gap: 1.75rem;
  }
}
</style>