<template>
  <div class="admin-orders-page">
    <div class="page-header" v-animate>
      <div>
        <h1 class="page-title">Gestão de Pedidos</h1>
        <p class="page-subtitle">Acompanhe as vendas, altere status e informe rastreios.</p>
      </div>
    </div>

    <div class="filters-card" v-animate>
      <div class="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" v-model="searchQuery" placeholder="Buscar por número do pedido ou nome do cliente...">
      </div>
      <div class="status-filters">
        <button class="status-tab" :class="{ active: filterStatus === '' }" @click="filterStatus = ''">Todos</button>
        <button class="status-tab" :class="{ active: filterStatus === 'pending' }" @click="filterStatus = 'pending'">Aguardando Pagamento</button>
        <button class="status-tab" :class="{ active: filterStatus === 'paid' }" @click="filterStatus = 'paid'">Pagos</button>
        <button class="status-tab" :class="{ active: filterStatus === 'shipped' }" @click="filterStatus = 'shipped'">Enviados</button>
        <button class="status-tab" :class="{ active: filterStatus === 'delivered' }" @click="filterStatus = 'delivered'">Entregues</button>
      </div>
    </div>

    <div class="table-card" v-animate>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="6" class="empty-state">
                Nenhum pedido encontrado.
              </td>
            </tr>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>
                <span class="order-id">#{{ order.id }}</span>
              </td>
              <td>
                <div class="client-info">
                  <span class="name">{{ order.customer_name }}</span>
                  <span class="email">{{ order.customer_email }}</span>
                </div>
              </td>
              <td>{{ order.date }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="price-cell">{{ formatPrice(order.total) }}</td>
              <td>
                <button class="btn-action">Gerenciar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterStatus = ref('')

const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const mockOrders = ref([
  { id: '10425', customer_name: 'Marcos Roberto', customer_email: 'marcos@email.com', date: 'Hoje, 10:45', status: 'paid', total: 2450.00 },
  { id: '10424', customer_name: 'Auto Mecânica Silva', customer_email: 'contato@mecanicasilva.com', date: 'Hoje, 09:12', status: 'pending', total: 890.00 },
  { id: '10423', customer_name: 'Transportes LogSul', customer_email: 'compras@logsul.com.br', date: 'Ontem, 16:30', status: 'paid', total: 5120.00 },
  { id: '10422', customer_name: 'João Paulo Dias', customer_email: 'joaopaulo@email.com', date: 'Ontem, 14:20', status: 'shipped', total: 340.00 },
  { id: '10421', customer_name: 'Viação Norte', customer_email: 'financeiro@viacaonorte.com', date: '12 Mai, 11:15', status: 'delivered', total: 1250.00 }
])

const filteredOrders = computed(() => {
  let result = mockOrders.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(o => 
      o.id.toLowerCase().includes(q) || 
      o.customer_name.toLowerCase().includes(q)
    )
  }

  if (filterStatus.value) {
    result = result.filter(o => o.status === filterStatus.value)
  }

  return result
})

const getStatusClass = (status) => {
  const map = {
    pending: 'status-pending',
    paid: 'status-paid',
    shipped: 'status-shipped',
    delivered: 'status-delivered'
  }
  return map[status] || ''
}

const getStatusText = (status) => {
  const map = {
    pending: 'Aguardando Pagamento',
    paid: 'Pago',
    shipped: 'Enviado',
    delivered: 'Entregue'
  }
  return map[status] || status
}
</script>

<style scoped>
.admin-orders-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.filters-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-bar svg {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
}

.search-bar input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-bar input:focus {
  border-color: var(--primary-light);
}

.status-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-tab {
  background-color: var(--surface-hover);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.6rem 1.25rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-tab:hover {
  border-color: var(--text-main);
  color: var(--text-main);
}

.status-tab.active {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
  color: #ffffff;
}

.table-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 800px;
}

.data-table th {
  background-color: var(--surface-hover);
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
}

.data-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.data-table tr:hover td {
  background-color: var(--surface-hover);
}

.data-table tr:last-child td {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  padding: 3rem !important;
  color: var(--text-muted);
  font-weight: 600;
}

.order-id {
  font-weight: 800;
  color: var(--text-main);
  font-size: 1rem;
}

.client-info {
  display: flex;
  flex-direction: column;
}

.client-info .name {
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.95rem;
}

.client-info .email {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.status-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
  white-space: nowrap;
}

.status-paid { background-color: rgba(0, 168, 89, 0.15); color: var(--primary-light); }
.status-pending { background-color: rgba(249, 115, 22, 0.15); color: #f97316; }
.status-shipped { background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.status-delivered { background-color: rgba(168, 85, 247, 0.15); color: #a855f7; }

.price-cell {
  font-weight: 800;
  color: var(--primary-dark);
}

.btn-action {
  background-color: var(--surface-hover);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
  color: #ffffff;
}
</style>