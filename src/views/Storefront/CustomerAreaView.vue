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
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 992px) {
  .layout-grid {
    grid-template-columns: 300px 1fr;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-profile-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 3.5rem;
  height: 3.5rem;
  background-color: var(--primary-light);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
}

.user-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: var(--text-main);
  font-weight: 700;
}

.user-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.sidebar-nav {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-nav button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  color: var(--text-main);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-nav button svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
  transition: color 0.2s;
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
  margin-top: 1rem;
  border-top: 1px solid var(--border-color);
  border-radius: 0;
  color: #ef4444;
}

.sidebar-nav .btn-logout:hover {
  background-color: #fef2f2;
}

.sidebar-nav .btn-logout svg {
  color: #ef4444;
}

.content-area h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 1.5rem 0;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
  background-color: var(--surface-color);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-light);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state svg {
  width: 4rem;
  height: 4rem;
  color: var(--border-color);
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  color: var(--text-main);
  font-size: 1.25rem;
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
  padding: 0.85rem 1.5rem;
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
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

@media (min-width: 640px) {
  .order-header {
    grid-template-columns: repeat(4, 1fr);
  }
}

.order-header > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-header span {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
}

.order-header strong {
  font-size: 1rem;
  color: var(--text-main);
  font-weight: 700;
}

.badge {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
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
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.item-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.item-name {
  flex-grow: 1;
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}

.form-group input {
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--surface-hover);
  color: var(--text-main);
  font-size: 1rem;
  outline: none;
}

.form-group input:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
}

.help-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}
</style>