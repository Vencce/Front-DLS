<template>
  <div class="order-management-page">
    <div class="page-header">
      <h1 class="page-title">Gestão de Pedidos</h1>
      <button class="btn-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Exportar Relatório
      </button>
    </div>

    <div class="filter-bar">
      <div class="search-input">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Buscar por número do pedido ou cliente...">
      </div>
      <div class="filter-actions">
        <select class="filter-select">
          <option value="">Status de Pagamento</option>
          <option value="pago">Aprovado</option>
          <option value="pendente">Aguardando PIX</option>
          <option value="recusado">Recusado</option>
        </select>
        <select class="filter-select">
          <option value="">Status Logístico</option>
          <option value="preparacao">Em Preparação</option>
          <option value="transporte">Em Transporte</option>
          <option value="entregue">Entregue</option>
        </select>
      </div>
    </div>

    <div class="panel">
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>#10046</strong></td>
              <td>18/05/2026 14:30</td>
              <td>
                <div class="customer-info">
                  <span class="customer-name">Carlos Souza</span>
                  <span class="customer-doc">CPF: 123.456.789-00</span>
                </div>
              </td>
              <td>R$ 1.450,00</td>
              <td><span class="pay-method pix">PIX</span></td>
              <td><span class="status-badge status-pending">Aguardando Pagamento</span></td>
              <td>
                <button class="action-btn">Detalhes</button>
              </td>
            </tr>
            <tr>
              <td><strong>#10045</strong></td>
              <td>15/05/2026 09:15</td>
              <td>
                <div class="customer-info">
                  <span class="customer-name">Viação Estrela LTDA</span>
                  <span class="customer-doc">CNPJ: 12.345.678/0001-90</span>
                </div>
              </td>
              <td>R$ 1.700,00</td>
              <td><span class="pay-method card">Cartão (Assimilar)</span></td>
              <td><span class="status-badge status-paid">Faturado</span></td>
              <td>
                <button class="action-btn">Detalhes</button>
              </td>
            </tr>
            <tr>
              <td><strong>#10044</strong></td>
              <td>14/05/2026 16:45</td>
              <td>
                <div class="customer-info">
                  <span class="customer-name">Marcos Silva</span>
                  <span class="customer-doc">CPF: 987.654.321-11</span>
                </div>
              </td>
              <td>R$ 890,00</td>
              <td><span class="pay-method card">Cartão (Sicred)</span></td>
              <td><span class="status-badge status-transit">Em Transporte</span></td>
              <td>
                <button class="action-btn">Detalhes</button>
              </td>
            </tr>
            <tr>
              <td><strong>#10043</strong></td>
              <td>12/05/2026 11:20</td>
              <td>
                <div class="customer-info">
                  <span class="customer-name">Transportes Log</span>
                  <span class="customer-doc">CNPJ: 98.765.432/0001-10</span>
                </div>
              </td>
              <td>R$ 4.200,00</td>
              <td><span class="pay-method pix">PIX</span></td>
              <td><span class="status-badge status-delivered">Entregue</span></td>
              <td>
                <button class="action-btn">Detalhes</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="pagination">
        <span class="page-info">Mostrando 1 a 4 de 1.250 pedidos</span>
        <div class="page-controls">
          <button class="page-btn" disabled>Anterior</button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn">Próxima</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.order-management-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  color: #111827;
  margin: 0;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-secondary svg {
  width: 1.25rem;
  height: 1.25rem;
}

.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

@media (min-width: 768px) {
  .filter-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.search-input {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
}

.search-input svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
}

.search-input input:focus {
  border-color: #eab308;
}

.filter-actions {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  background-color: #ffffff;
}

.panel {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
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
  background-color: #f9fafb;
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.admin-table td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.admin-table tr:hover td {
  background-color: #f9fafb;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 600;
  color: #111827;
}

.customer-doc {
  font-size: 0.75rem;
  color: #6b7280;
}

.pay-method {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
}

.pay-method.pix {
  background-color: #ccfbf1;
  color: #0f766e;
}

.pay-method.card {
  background-color: #f3f4f6;
  color: #4b5563;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  white-space: nowrap;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-paid {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-transit {
  background-color: #f3e8ff;
  color: #6b21a8;
}

.status-delivered {
  background-color: #d1fae5;
  color: #065f46;
}

.action-btn {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #e5e7eb;
}

.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  gap: 1rem;
}

@media (min-width: 640px) {
  .pagination {
    flex-direction: row;
  }
}

.page-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.page-controls {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #374151;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background-color: #f9fafb;
}

.page-btn.active {
  background-color: #111827;
  color: #ffffff;
  border-color: #111827;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>