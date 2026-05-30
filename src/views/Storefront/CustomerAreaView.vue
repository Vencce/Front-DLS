<template>
  <div class="customer-area-page">
    <div class="container">
      <div class="header-section">
        <h1 class="page-title">Minha Conta</h1>
        <p class="welcome-text">Bem-vindo ao seu painel de controle.</p>
      </div>

      <div class="account-layout">
        <aside class="account-sidebar">
          <nav class="account-nav">
            <a href="#" class="nav-item active">Meus Pedidos</a>
            <a href="#" class="nav-item">Meus Dados</a>
            <a href="#" class="nav-item">Endereços</a>
            <a href="#" class="nav-item logout">Sair</a>
          </nav>
        </aside>

        <main class="account-content">
          <h2>Histórico de Pedidos</h2>

          <div class="orders-list">
            <div class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <span class="order-number">Pedido #10045</span>
                  <span class="order-date">Realizado em 15/05/2026</span>
                </div>
                <span class="order-status status-transit">Em Transporte</span>
              </div>
              
              <div class="order-body">
                <div class="order-items">
                  <div class="item-line">
                    <span class="item-qty">1x</span>
                    <span class="item-name">Bico Injetor Diesel Common Rail Bosch</span>
                  </div>
                  <div class="item-line">
                    <span class="item-qty">2x</span>
                    <span class="item-name">Filtro de Combustível Separador Scania</span>
                  </div>
                </div>
                
                <div class="order-summary">
                  <div class="summary-line">
                    <span>Total:</span>
                    <span class="total-value">R$ 1.700,00</span>
                  </div>
                  <div class="summary-line tracking-line">
                    <span>Rastreio (Vapt):</span>
                    <a href="#" class="tracking-link">VAPT987654321BR</a>
                  </div>
                </div>
              </div>
              
              <div class="order-footer">
                <button class="btn-action">Ver Detalhes</button>
                <button class="btn-action btn-outline">Comprar Novamente</button>
              </div>
            </div>

            <div class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <span class="order-number">Pedido #09882</span>
                  <span class="order-date">Realizado em 02/04/2026</span>
                </div>
                <span class="order-status status-delivered">Entregue</span>
              </div>
              
              <div class="order-body">
                <div class="order-items">
                  <div class="item-line">
                    <span class="item-qty">1x</span>
                    <span class="item-name">Bomba de Alta Pressão Cummins</span>
                  </div>
                </div>
                
                <div class="order-summary">
                  <div class="summary-line">
                    <span>Total:</span>
                    <span class="total-value">R$ 3.245,90</span>
                  </div>
                </div>
              </div>
              
              <div class="order-footer">
                <button class="btn-action">Ver Detalhes</button>
                <button class="btn-action btn-outline">Comprar Novamente</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.customer-area-page {
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header-section {
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.25rem;
  color: #004d28;
  margin: 0 0 0.5rem 0;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.welcome-text {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
  font-weight: 500;
}

.account-layout {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .account-layout {
    flex-direction: row;
    align-items: flex-start;
  }
}

.account-sidebar {
  width: 100%;
  background-color: #ffffff;
  border: none;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

@media (min-width: 768px) {
  .account-sidebar {
    width: 280px;
    flex-shrink: 0;
  }
}

.account-nav {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .account-nav {
    flex-direction: column;
    overflow-x: visible;
  }
}

.nav-item {
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  color: #4b5563;
  font-weight: 600;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

@media (min-width: 768px) {
  .nav-item {
    border-bottom: 1px solid #f3f4f6;
    border-left: 4px solid transparent;
  }
  
  .nav-item:last-child {
    border-bottom: none;
  }
}

.nav-item:hover {
  background-color: #f9fafb;
  color: #111827;
}

.nav-item.active {
  color: #00a859;
  border-bottom-color: #00a859;
}

@media (min-width: 768px) {
  .nav-item.active {
    border-bottom-color: #f3f4f6;
    border-left-color: #00a859;
    background-color: #e6f4ea;
  }
}

.nav-item.logout {
  color: #ef4444;
}

.nav-item.logout:hover {
  background-color: #fef2f2;
}

.account-content {
  flex-grow: 1;
  width: 100%;
}

.account-content h2 {
  font-size: 1.5rem;
  color: #004d28;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background-color: #ffffff;
  border: none;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.order-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
  gap: 1rem;
}

@media (min-width: 640px) {
  .order-header {
    flex-direction: row;
    align-items: center;
    gap: 0;
  }
}

.order-info {
  display: flex;
  flex-direction: column;
}

.order-number {
  font-weight: 800;
  color: #111827;
  font-size: 1.125rem;
}

.order-date {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.order-status {
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
}

.status-transit {
  background-color: #fef3c7;
  color: #b45309;
}

.status-delivered {
  background-color: #e6f4ea;
  color: #00a859;
}

.order-body {
  padding: 1.5rem;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.item-line {
  display: flex;
  gap: 1rem;
  font-size: 1rem;
}

.item-qty {
  font-weight: 800;
  color: #00a859;
  min-width: 25px;
}

.item-name {
  color: #111827;
  font-weight: 500;
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
}

.total-value {
  font-weight: 800;
  color: #111827;
  font-size: 1.25rem;
}

.tracking-line {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #4b5563;
}

.tracking-link {
  color: #00a859;
  text-decoration: none;
  font-weight: 700;
}

.tracking-link:hover {
  text-decoration: underline;
}

.order-footer {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
  gap: 1rem;
}

@media (min-width: 640px) {
  .order-footer {
    flex-direction: row;
    justify-content: flex-end;
  }
}

.btn-action {
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  border: none;
  background-color: #004d28;
  color: #ffffff;
}

.btn-action:hover {
  background-color: #00361c;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid #d1d5db;
  color: #4b5563;
}

.btn-outline:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #111827;
}
</style>