<template>
  <div class="admin-customers-page">
    <div class="page-header" v-animate>
      <div>
        <h1 class="page-title">Gestão de Clientes</h1>
        <p class="page-subtitle">Visualize e gerencie a base de clientes da sua loja.</p>
      </div>
      <button class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Cliente
      </button>
    </div>

    <div class="filters-card" v-animate>
      <div class="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" v-model="searchQuery" placeholder="Buscar por nome, e-mail ou CPF/CNPJ...">
      </div>
      <div class="status-filters">
        <button class="status-tab" :class="{ active: filterStatus === '' }" @click="filterStatus = ''">Todos</button>
        <button class="status-tab" :class="{ active: filterStatus === 'active' }" @click="filterStatus = 'active'">Ativos</button>
        <button class="status-tab" :class="{ active: filterStatus === 'inactive' }" @click="filterStatus = 'inactive'">Inativos</button>
      </div>
    </div>

    <div class="table-card" v-animate>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contato</th>
              <th>Data de Cadastro</th>
              <th>Pedidos</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="6" class="empty-state">
                Nenhum cliente encontrado.
              </td>
            </tr>
            <tr v-for="customer in filteredCustomers" :key="customer.id">
              <td>
                <div class="client-cell">
                  <div class="avatar">{{ customer.name.charAt(0).toUpperCase() }}</div>
                  <div class="client-info">
                    <span class="name">{{ customer.name }}</span>
                    <span class="document">{{ customer.document }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="contact-info">
                  <span class="email">{{ customer.email }}</span>
                  <span class="phone">{{ customer.phone }}</span>
                </div>
              </td>
              <td>{{ customer.registeredAt }}</td>
              <td>
                <span class="orders-count">{{ customer.totalOrders }}</span>
              </td>
              <td>
                <span class="status-badge" :class="customer.status === 'active' ? 'status-active' : 'status-inactive'">
                  {{ customer.status === 'active' ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon edit" title="Editar Cliente">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </div>
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

const mockCustomers = ref([
  { id: 1, name: 'Marcos Roberto', document: '123.456.789-00', email: 'marcos@email.com', phone: '(11) 98765-4321', registeredAt: '10/05/2023', totalOrders: 12, status: 'active' },
  { id: 2, name: 'Auto Mecânica Silva', document: '12.345.678/0001-90', email: 'contato@mecanicasilva.com', phone: '(47) 3322-1100', registeredAt: '15/08/2023', totalOrders: 45, status: 'active' },
  { id: 3, name: 'Transportes LogSul', document: '98.765.432/0001-10', email: 'compras@logsul.com.br', phone: '(51) 3456-7890', registeredAt: '02/11/2023', totalOrders: 8, status: 'active' },
  { id: 4, name: 'João Paulo Dias', document: '456.789.123-11', email: 'joaopaulo@email.com', phone: '(41) 99999-8888', registeredAt: '20/01/2024', totalOrders: 1, status: 'inactive' },
  { id: 5, name: 'Viação Norte', document: '11.222.333/0001-44', email: 'financeiro@viacaonorte.com', phone: '(92) 3333-4444', registeredAt: '05/03/2024', totalOrders: 3, status: 'active' }
])

const filteredCustomers = computed(() => {
  let result = mockCustomers.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q) ||
      c.document.includes(q)
    )
  }

  if (filterStatus.value) {
    result = result.filter(c => c.status === filterStatus.value)
  }

  return result
})
</script>

<style scoped>
.admin-customers-page {
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

.btn-primary {
  background-color: var(--primary-light);
  color: #ffffff;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 168, 89, 0.3);
}

.btn-primary svg {
  width: 1.25rem;
  height: 1.25rem;
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

.client-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: var(--primary-light-bg);
  color: var(--primary-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  flex-shrink: 0;
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

.client-info .document {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-info .email {
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 600;
}

.contact-info .phone {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.orders-count {
  background-color: var(--surface-hover);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-weight: 800;
  color: var(--text-main);
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
  white-space: nowrap;
}

.status-active {
  background-color: rgba(0, 168, 89, 0.15);
  color: var(--primary-light);
}

.status-inactive {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-muted);
}

.btn-icon.edit:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.btn-icon svg {
  width: 1.1rem;
  height: 1.1rem;
}
</style>