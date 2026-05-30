<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">Configurações do Sistema</h1>
      <button class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Salvar Alterações
      </button>
    </div>

    <div class="settings-layout">
      <div class="settings-sidebar">
        <nav class="settings-nav">
          <a href="#" class="nav-item active">Geral</a>
          <a href="#" class="nav-item">Integração de Pagamento</a>
          <a href="#" class="nav-item">Integração Logística</a>
          <a href="#" class="nav-item">Notificações</a>
        </nav>
      </div>

      <div class="settings-content">
        <section class="settings-panel">
          <div class="panel-header">
            <h2>Dados da Loja</h2>
            <p>Informações básicas que aparecem no rodapé e nos e-mails para o cliente.</p>
          </div>
          <div class="panel-body">
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="store_name">Nome da Loja</label>
                <input type="text" id="store_name" value="DLS Auto Peças">
              </div>
              <div class="form-group">
                <label for="cnpj">CNPJ</label>
                <input type="text" id="cnpj" value="57.502.966/0001-44">
              </div>
              <div class="form-group">
                <label for="contact_email">E-mail de Contato</label>
                <input type="email" id="contact_email" value="contato@dlsautopecas.com.br">
              </div>
              <div class="form-group full-width">
                <label for="address">Endereço Físico</label>
                <input type="text" id="address" value="Rua São Paulo 3339, Joinville - SC">
              </div>
            </div>
          </div>
        </section>

        <section class="settings-panel">
          <div class="panel-header">
            <h2>Gateways de Pagamento</h2>
            <p>Credenciais de API para processamento via Sicred e Assimilar.</p>
          </div>
          <div class="panel-body">
            <div class="integration-group">
              <div class="integration-header">
                <h3>Sicred (PIX e Cartão)</h3>
                <div class="toggle-switch">
                  <input type="checkbox" id="sicred_active" checked>
                  <label for="sicred_active"></label>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="sicred_client_id">Client ID</label>
                  <input type="text" id="sicred_client_id" placeholder="Insira o Client ID fornecido pelo Sicred">
                </div>
                <div class="form-group full-width">
                  <label for="sicred_client_secret">Client Secret</label>
                  <input type="password" id="sicred_client_secret" placeholder="Insira o Client Secret">
                </div>
                <div class="form-group full-width">
                  <label for="sicred_webhook">URL do Webhook (Cópia para o banco)</label>
                  <div class="input-with-copy">
                    <input type="text" id="sicred_webhook" value="https://api.dlsautopecas.com.br/webhooks/sicred" readonly>
                    <button type="button" class="copy-btn">Copiar</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="integration-group divider">
              <div class="integration-header">
                <h3>Assimilar (Cartão de Crédito Secundário)</h3>
                <div class="toggle-switch">
                  <input type="checkbox" id="assimilar_active">
                  <label for="assimilar_active"></label>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="assimilar_token">Token de Acesso (Bearer)</label>
                  <input type="password" id="assimilar_token" placeholder="Insira o Token da Assimilar">
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="settings-panel">
          <div class="panel-header">
            <h2>Logística (Vapt)</h2>
            <p>Configurações para cálculo de frete e emissão de etiquetas.</p>
          </div>
          <div class="panel-body">
            <div class="form-grid">
              <div class="form-group">
                <label for="cep_origem">CEP de Origem (Remetente)</label>
                <input type="text" id="cep_origem" value="89200-000">
              </div>
              <div class="form-group">
                <label for="vapt_api_key">Chave de API (Vapt)</label>
                <input type="password" id="vapt_api_key" placeholder="Insira a chave de integração">
              </div>
              <div class="form-group full-width">
                <label>Dias adicionais de preparo (Adicionado ao prazo do frete)</label>
                <input type="number" id="dias_preparo" value="1" min="0">
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.settings-page {
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

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #059669;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #047857;
}

.btn-primary svg {
  width: 1.25rem;
  height: 1.25rem;
}

.settings-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .settings-layout {
    grid-template-columns: 250px 1fr;
  }
}

.settings-sidebar {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  position: sticky;
  top: 1.5rem;
}

.settings-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  border-left: 3px solid transparent;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-item:hover {
  background-color: #f9fafb;
  color: #111827;
}

.nav-item.active {
  background-color: #f3f4f6;
  color: #111827;
  border-left-color: #eab308;
  font-weight: 600;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-panel {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.panel-header h2 {
  font-size: 1.125rem;
  margin: 0 0 0.25rem 0;
  color: #111827;
}

.panel-header p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.panel-body {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #111827;
  outline: none;
  background-color: #ffffff;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #eab308;
  box-shadow: 0 0 0 1px #eab308;
}

.form-group input[readonly] {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.input-with-copy {
  display: flex;
  gap: 0.5rem;
}

.input-with-copy input {
  flex-grow: 1;
}

.copy-btn {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 0 1rem;
  border-radius: 0.375rem;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background-color: #e5e7eb;
}

.integration-group {
  padding-bottom: 1.5rem;
}

.integration-group.divider {
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  padding-bottom: 0;
}

.integration-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.integration-header h3 {
  font-size: 1rem;
  color: #111827;
  margin: 0;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: .4s;
  border-radius: 24px;
}

.toggle-switch label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle-switch input:checked + label {
  background-color: #059669;
}

.toggle-switch input:checked + label:before {
  transform: translateX(20px);
}
</style>