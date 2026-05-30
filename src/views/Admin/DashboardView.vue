<template>
  <div class="dashboard-page">
    <div class="page-header" v-animate>
      <h1 class="page-title">Visão Geral</h1>
      <div class="date-filter">
        <select>
          <option value="hoje">Hoje</option>
          <option value="semana">Últimos 7 dias</option>
          <option value="mes" selected>Este Mês</option>
        </select>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card" v-animate>
        <div class="metric-icon bg-blue">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Vendas no Mês</span>
          <span class="metric-value">R$ 45.890,00</span>
        </div>
      </div>

      <div class="metric-card" v-animate>
        <div class="metric-icon bg-green">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Pedidos Concluídos</span>
          <span class="metric-value">124</span>
        </div>
      </div>

      <div class="metric-card" v-animate>
        <div class="metric-icon bg-yellow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Aguardando Pagamento</span>
          <span class="metric-value">8</span>
        </div>
      </div>

      <div class="metric-card" v-animate>
        <div class="metric-icon bg-red">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Estoque Baixo</span>
          <span class="metric-value">12 itens</span>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="panel recent-orders" v-animate>
        <div class="panel-header">
          <h2>Últimos Pedidos</h2>
          <router-link to="/admin/pedidos" class="view-all">Ver todos</router-link>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>#10046</strong></td>
                <td>Carlos Souza</td>
                <td>18/05/2026</td>
                <td>R$ 1.450,00</td>
                <td><span class="status-badge status-pending">Aguardando PIX</span></td>
              </tr>
              <tr>
                <td><strong>#10045</strong></td>
                <td>Viação Estrela</td>
                <td>15/05/2026</td>
                <td>R$ 1.700,00</td>
                <td><span class="status-badge status-paid">Faturado</span></td>
              </tr>
              <tr>
                <td><strong>#10044</strong></td>
                <td>Marcos Silva</td>
                <td>14/05/2026</td>
                <td>R$ 890,00</td>
                <td><span class="status-badge status-transit">Em Transporte</span></td>
              </tr>
              <tr>
                <td><strong>#10043</strong></td>
                <td>Transportes Log</td>
                <td>12/05/2026</td>
                <td>R$ 4.200,00</td>
                <td><span class="status-badge status-delivered">Entregue</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel stock-alerts" v-animate>
        <div class="panel-header">
          <h2>Alertas de Estoque</h2>
          <router-link to="/admin/produtos" class="view-all">Ver produtos</router-link>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bico Injetor Diesel Common Rail Bosch</td>
                <td><span class="text-red font-bold">2</span></td>
                <td><button class="action-btn">Repor</button></td>
              </tr>
              <tr>
                <td>Filtro de Combustível Separador Scania</td>
                <td><span class="text-red font-bold">0</span></td>
                <td><button class="action-btn">Repor</button></td>
              </tr>
              <tr>
                <td>Kit Camisa e Pistão MWM 229</td>
                <td><span class="text-yellow font-bold">5</span></td>
                <td><button class="action-btn">Repor</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

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
    align-items: center;
  }
}

.page-title {
  font-size: 2rem;
  color: var(--text-main);
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.date-filter select {
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--surface-color);
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.3s ease, color 0.3s ease;
}

.date-filter select:focus {
  border-color: var(--primary-light);
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.metric-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.metric-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon svg {
  width: 1.75rem;
  height: 1.75rem;
}

.bg-blue {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.bg-green {
  background-color: var(--primary-light-bg);
  color: var(--primary-light);
}

.bg-yellow {
  background-color: rgba(217, 119, 6, 0.15);
  color: #d97706;
}

.bg-red {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
}

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
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.panel-header h2 {
  font-size: 1.25rem;
  margin: 0;
  color: var(--text-main);
  font-weight: 700;
}

.view-all {
  font-size: 0.95rem;
  color: var(--primary-light);
  text-decoration: none;
  font-weight: 600;
}

.view-all:hover {
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
  transition: background-color 0.3s ease;
}

.admin-table td {
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
}

.admin-table tr:hover td {
  background-color: var(--surface-hover);
}

.admin-table tr:last-child td {
  border-bottom: none;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
}

.status-pending {
  background-color: rgba(217, 119, 6, 0.15);
  color: #b45309;
}

.status-paid {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.status-transit {
  background-color: rgba(126, 34, 206, 0.15);
  color: #7e22ce;
}

.status-delivered {
  background-color: var(--primary-light-bg);
  color: var(--primary-light);
}

.text-red { color: #ef4444; }
.text-yellow { color: #d97706; }
.font-bold { font-weight: 800; }

.action-btn {
  background-color: var(--surface-hover);
  border: none;
  color: var(--text-main);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--primary-light);
  color: #ffffff;
}
</style>