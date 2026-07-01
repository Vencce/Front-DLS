<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../../stores/productStore'
import api from '../../services/api'

const productStore = useProductStore()

const loading = ref(true)
const stats = ref({
  faturamento_total: 0,
  pedidos_realizados: 0,
  novos_clientes: 0
})
const recentOrders = ref([])
const topProducts = ref([])

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(date)
}

const getStatusClass = (status) => {
  const statusLower = String(status).toLowerCase()
  if (statusLower.includes('pago') || statusLower.includes('concluido')) return 'status-paid'
  if (statusLower.includes('enviado')) return 'status-shipped'
  return 'status-pending'
}

const fetchDashboardData = async () => {
  try {
    loading.value = true
    const response = await api.get('/dashboard/resumo/')
    
    stats.value = response.data.estatisticas || { faturamento_total: 0, pedidos_realizados: 0, novos_clientes: 0 }
    recentOrders.value = response.data.ultimos_pedidos || []
    topProducts.value = response.data.produtos_mais_vendidos || []
    
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  productStore.fetchProducts({ page: 1 })
  fetchDashboardData()
})
</script>

<template>
  <div class="dashboard-page">
    <div class="page-header" v-animate>
      <div>
        <h1 class="page-title">Visão Geral</h1>
        <p class="page-subtitle">Acompanhe o desempenho e as métricas da sua loja.</p>
      </div>
      <div class="date-filter">
        <select class="filter-select" @change="fetchDashboardData">
          <option value="hoje">Hoje</option>
          <option value="7d">Últimos 7 dias</option>
          <option value="mes" selected>Este Mês</option>
          <option value="ano">Este Ano</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state" style="text-align: center; padding: 2rem;">
      <p>Carregando dados da loja...</p>
    </div>

    <div v-else>
      <div class="stats-grid" v-animate>
        <div class="stat-card">
          <div class="stat-icon bg-green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-details">
            <span class="stat-label">Faturamento Total</span>
            <span class="stat-value">{{ formatPrice(stats.faturamento_total) }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div class="stat-details">
            <span class="stat-label">Pedidos Realizados</span>
            <span class="stat-value">{{ stats.pedidos_realizados }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-orange">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="stat-details">
            <span class="stat-label">Produtos Ativos</span>
            <span class="stat-value">{{ productStore.totalItems }}</span>
            <div class="stat-trend neutral">
              No catálogo
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-purple">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="stat-details">
            <span class="stat-label">Novos Clientes</span>
            <span class="stat-value">{{ stats.novos_clientes }}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-content" v-animate style="margin-top: 2rem;">
        <div class="panel recent-orders">
          <div class="panel-header">
            <h2>Últimos Pedidos</h2>
            <button class="btn-text" @click="$router.push('/admin/pedidos')">Ver todos</button>
          </div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="recentOrders.length === 0">
                  <td colspan="5" style="text-align: center;">Nenhum pedido encontrado.</td>
                </tr>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td><strong>#{{ order.id }}</strong></td>
                  <td>{{ order.cliente_nome }}</td>
                  <td>{{ formatDate(order.data_criacao) }}</td>
                  <td>
                    <span :class="['status-badge', getStatusClass(order.status)]">
                      {{ order.status_display || order.status }}
                    </span>
                  </td>
                  <td class="font-bold text-main">{{ formatPrice(order.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="panel top-products">
          <div class="panel-header">
            <h2>Produtos Mais Vendidos</h2>
          </div>
          <div class="top-list">
            <div v-if="topProducts.length === 0" style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
              Sem dados de vendas suficientes.
            </div>
            <div class="top-item" v-for="(product, index) in topProducts" :key="product.id">
              <div class="item-rank">{{ index + 1 }}</div>
              <div class="item-info">
                <h4>{{ product.nome }}</h4>
                <span>{{ product.quantidade_vendida }} unidades vendidas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.page-title {
  font-size: 2rem;
  color: var(--text-main);
  margin: 0 0 0.25rem 0;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: var(--text-muted);
  margin: 0;
  font-weight: 500;
}

.filter-select {
  padding: 0.75rem 1rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-main);
  font-weight: 600;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  border-color: var(--primary-light);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 1.75rem;
  height: 1.75rem;
}

.bg-green { background-color: rgba(0, 168, 89, 0.15); color: var(--primary-light); }
.bg-blue { background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.bg-orange { background-color: rgba(249, 115, 22, 0.15); color: #f97316; }
.bg-purple { background-color: rgba(168, 85, 247, 0.15); color: #a855f7; }

.stat-details {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-trend svg {
  width: 1rem;
  height: 1rem;
}

.stat-trend.positive { color: var(--primary-light); }
.stat-trend.negative { color: #ef4444; }
.stat-trend.neutral { color: var(--text-muted); font-weight: 500; }

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 2fr 1fr;
  }
}

.panel {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.btn-text {
  background: none;
  border: none;
  color: var(--primary-light);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-text:hover {
  text-decoration: underline;
}

.table-responsive {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background-color: var(--surface-hover);
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
}

.admin-table td {
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.admin-table tr:hover td {
  background-color: var(--surface-hover);
}

.admin-table tr:last-child td {
  border-bottom: none;
}

.font-bold { font-weight: 700; }
.text-main { color: var(--text-main); }

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
  white-space: nowrap;
}

.status-paid { background-color: rgba(0, 168, 89, 0.15); color: var(--primary-light); }
.status-pending { background-color: rgba(249, 115, 22, 0.15); color: #f97316; }
.status-shipped { background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; }

.top-list {
  padding: 0.5rem 1.5rem;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px dashed var(--border-color);
}

.top-item:last-child {
  border-bottom: none;
}

.item-rank {
  width: 32px;
  height: 32px;
  background-color: var(--surface-hover);
  color: var(--text-main);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.top-item:nth-child(1) .item-rank { background-color: rgba(234, 179, 8, 0.2); color: #ca8a04; }
.top-item:nth-child(2) .item-rank { background-color: rgba(148, 163, 184, 0.2); color: #64748b; }
.top-item:nth-child(3) .item-rank { background-color: rgba(180, 83, 9, 0.2); color: #92400e; }

.item-info {
  display: flex;
  flex-direction: column;
}

.item-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  color: var(--text-main);
  font-weight: 700;
}

.item-info span {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>