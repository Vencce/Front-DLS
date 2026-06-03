<template>
  <div class="dashboard-page">
    <div class="page-header" v-animate>
      <div>
        <h1 class="page-title">Visão Geral</h1>
        <p class="page-subtitle">Acompanhe o desempenho e as métricas da sua loja.</p>
      </div>
      <div class="date-filter">
        <select class="filter-select">
          <option>Hoje</option>
          <option>Últimos 7 dias</option>
          <option selected>Este Mês</option>
          <option>Este Ano</option>
        </select>
      </div>
    </div>

    <div class="stats-grid" v-animate>
      <div class="stat-card">
        <div class="stat-icon bg-green">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-details">
          <span class="stat-label">Faturamento Total</span>
          <span class="stat-value">R$ 142.350,00</span>
          <div class="stat-trend positive">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
            </svg>
            +12.5% em relação ao mês anterior
          </div>
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
          <span class="stat-value">384</span>
          <div class="stat-trend positive">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
            </svg>
            +5.2% em relação ao mês anterior
          </div>
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
          <span class="stat-value">{{ productStore.totalItems || 0 }}</span>
          <div class="stat-trend neutral">
            Total de itens cadastrados no catálogo
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
          <span class="stat-value">128</span>
          <div class="stat-trend negative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
            </svg>
            -2.1% em relação ao mês anterior
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-content" v-animate>
      <div class="panel recent-orders">
        <div class="panel-header">
          <h2>Últimos Pedidos</h2>
          <button class="btn-text">Ver todos</button>
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
              <tr>
                <td><strong>#10425</strong></td>
                <td>Marcos Roberto</td>
                <td>Hoje, 10:45</td>
                <td><span class="status-badge status-paid">Pago</span></td>
                <td class="font-bold text-main">R$ 2.450,00</td>
              </tr>
              <tr>
                <td><strong>#10424</strong></td>
                <td>Auto Mecânica Silva</td>
                <td>Hoje, 09:12</td>
                <td><span class="status-badge status-pending">Aguardando Pagamento</span></td>
                <td class="font-bold text-main">R$ 890,00</td>
              </tr>
              <tr>
                <td><strong>#10423</strong></td>
                <td>Transportes LogSul</td>
                <td>Ontem, 16:30</td>
                <td><span class="status-badge status-paid">Pago</span></td>
                <td class="font-bold text-main">R$ 5.120,00</td>
              </tr>
              <tr>
                <td><strong>#10422</strong></td>
                <td>João Paulo Dias</td>
                <td>Ontem, 14:20</td>
                <td><span class="status-badge status-shipped">Enviado</span></td>
                <td class="font-bold text-main">R$ 340,00</td>
              </tr>
              <tr>
                <td><strong>#10421</strong></td>
                <td>Viação Norte</td>
                <td>12 Mai, 11:15</td>
                <td><span class="status-badge status-shipped">Enviado</span></td>
                <td class="font-bold text-main">R$ 1.250,00</td>
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
          <div class="top-item">
            <div class="item-rank">1</div>
            <div class="item-info">
              <h4>Bico Injetor Bosch Amarok</h4>
              <span>42 unidades vendidas</span>
            </div>
          </div>
          <div class="top-item">
            <div class="item-rank">2</div>
            <div class="item-info">
              <h4>Kit Filtros Scania P360</h4>
              <span>38 unidades vendidas</span>
            </div>
          </div>
          <div class="top-item">
            <div class="item-rank">3</div>
            <div class="item-info">
              <h4>Bomba de Alta Pressão HR</h4>
              <span>25 unidades vendidas</span>
            </div>
          </div>
          <div class="top-item">
            <div class="item-rank">4</div>
            <div class="item-info">
              <h4>Turbina Master Power</h4>
              <span>18 unidades vendidas</span>
            </div>
          </div>
          <div class="top-item">
            <div class="item-rank">5</div>
            <div class="item-info">
              <h4>Sensor de Pressão Rail</h4>
              <span>15 unidades vendidas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '../../stores/productStore'

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts({ page: 1 })
})
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