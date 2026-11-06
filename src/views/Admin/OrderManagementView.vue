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
        <input type="text" v-model="busca" placeholder="Buscar por número do pedido ou nome do cliente...">
      </div>
      <div class="status-filters">
        <button class="status-tab" :class="{ active: filtroStatus === '' }" @click="filtroStatus = ''">Todos</button>
        <button class="status-tab" :class="{ active: filtroStatus === 'pending' }" @click="filtroStatus = 'pending'">Aguardando Pagamento</button>
        <button class="status-tab" :class="{ active: filtroStatus === 'paid' }" @click="filtroStatus = 'paid'">Pagos</button>
        <button class="status-tab" :class="{ active: filtroStatus === 'shipped' }" @click="filtroStatus = 'shipped'">Enviados</button>
        <button class="status-tab" :class="{ active: filtroStatus === 'delivered' }" @click="filtroStatus = 'delivered'">Entregues</button>
      </div>
    </div>

    <div v-if="carregando" class="loading-state" style="text-align: center; padding: 2rem;">
      <p>Carregando pedidos...</p>
    </div>

    <div v-else class="table-card" v-animate>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Produtos</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pedidosFiltrados.length === 0">
              <td colspan="7" class="empty-state">
                Nenhum pedido encontrado.
              </td>
            </tr>
            <tr v-for="pedido in pedidosFiltrados" :key="pedido.id">
              <td>
                <span class="order-id">#{{ pedido.id }}</span>
              </td>
              <td>
                <div class="produtos-cell" :title="listaCompletaProdutos(pedido)">
                  <span class="produtos-nome">{{ resumoProdutos(pedido) }}</span>
                  <span class="produtos-qtd">{{ totalItensPedido(pedido) }} {{ totalItensPedido(pedido) === 1 ? 'unidade' : 'unidades' }}</span>
                </div>
              </td>
              <td>
                <div class="client-info">
                  <span class="name">{{ pedido.customer_name || pedido.cliente_nome || 'Cliente não informado' }}</span>
                  <span class="email">{{ pedido.customer_email || pedido.cliente_email || '' }}</span>
                </div>
              </td>
              <td>{{ formatarData(pedido.created_at || pedido.data_criacao || pedido.date || pedido.data) }}</td>
              <td>
                <span class="status-badge" :class="obterClasseStatus(pedido.status)">
                  {{ obterTextoStatus(pedido.status) }}
                </span>
              </td>
              <td class="price-cell">{{ formatarPreco(pedido.total) }}</td>
              <td class="actions-cell">
                <button class="btn-action" @click="abrirDetalhes(pedido)">Gerenciar</button>
                <button class="btn-action btn-delete" @click="excluirPedido(pedido)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" v-if="mostrarDetalhes" @click.self="fecharDetalhes">
      <div class="modal-content" v-if="pedidoSelecionado">
        <div class="modal-header">
          <h2>Detalhes do Pedido</h2>
          <button type="button" class="close-modal" @click="fecharDetalhes">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="detail-top">
            <span class="detail-uuid">#{{ pedidoSelecionado.id }}</span>
            <span class="status-badge" :class="obterClasseStatus(pedidoSelecionado.status)">
              {{ obterTextoStatus(pedidoSelecionado.status) }}
            </span>
          </div>

          <div class="detail-section">
            <h3>Cliente</h3>
            <div class="detail-grid">
              <div><span class="detail-label">Nome</span><span class="detail-value">{{ pedidoSelecionado.customer_name }}</span></div>
              <div><span class="detail-label">E-mail</span><span class="detail-value">{{ pedidoSelecionado.customer_email }}</span></div>
              <div><span class="detail-label">Telefone</span><span class="detail-value">{{ pedidoSelecionado.customer_phone || 'Não informado' }}</span></div>
              <div><span class="detail-label">CPF</span><span class="detail-value">{{ pedidoSelecionado.customer_cpf || 'Não informado' }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Entrega</h3>
            <p class="detail-text">{{ pedidoSelecionado.address }}</p>
            <p class="detail-text" v-if="pedidoSelecionado.complement">Complemento: {{ pedidoSelecionado.complement }}</p>
            <p class="detail-text">
              {{ pedidoSelecionado.shipping_service || 'Frete não informado' }}
              — {{ formatarPreco(pedidoSelecionado.shipping_fee) }}
              <span v-if="pedidoSelecionado.shipping_deadline_days">
                ({{ pedidoSelecionado.shipping_deadline_days }} dia(s) úteis)
              </span>
            </p>
          </div>

          <div class="detail-section">
            <h3>Itens do Pedido</h3>
            <table class="detail-items-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Qtd</th>
                  <th>Unitário</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in (pedidoSelecionado.items || [])" :key="item.product_id">
                  <td>{{ nomeProduto(item.product_name) }}</td>
                  <td>{{ item.product_sku }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatarPreco(item.unit_price) }}</td>
                  <td>{{ formatarPreco(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="detail-total">
            <span>Total do Pedido</span>
            <strong>{{ formatarPreco(pedidoSelecionado.total) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'

const busca = ref('')
const filtroStatus = ref('')
const pedidos = ref([])
const carregando = ref(true)

const mostrarDetalhes = ref(false)
const pedidoSelecionado = ref(null)

const formatarPreco = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0)
}

const formatarData = (stringData) => {
  if (!stringData) return ''
  const data = new Date(stringData)
  if (isNaN(data.getTime())) return stringData
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(data)
}

const nomeProduto = (nome) => {
  if (!nome) return 'Produto'
  return nome.charAt(0).toUpperCase() + nome.slice(1)
}

const totalItensPedido = (pedido) => {
  const items = pedido.items || []
  return items.reduce((soma, item) => soma + (item.quantity || 0), 0)
}

const resumoProdutos = (pedido) => {
  const items = pedido.items || []
  if (items.length === 0) return 'Sem itens'

  const principal = items[0]
  let texto = nomeProduto(principal.product_name)
  if (principal.quantity > 1) texto += ` (${principal.quantity}x)`

  const restantes = items.length - 1
  if (restantes > 0) {
    texto += ` + ${restantes} ${restantes === 1 ? 'item' : 'itens'}`
  }
  return texto
}

const listaCompletaProdutos = (pedido) => {
  const items = pedido.items || []
  return items.map(item => `${item.quantity}x ${nomeProduto(item.product_name)}`).join('\n')
}

const abrirDetalhes = (pedido) => {
  pedidoSelecionado.value = pedido
  mostrarDetalhes.value = true
}

const fecharDetalhes = () => {
  mostrarDetalhes.value = false
  pedidoSelecionado.value = null
}

const excluirPedido = async (pedido) => {
  const confirmado = window.confirm(
    `Excluir o pedido #${pedido.id} definitivamente? Essa ação não pode ser desfeita.`
  )
  if (!confirmado) return

  try {
    await api.delete(`/orders/${pedido.id}/`)
    pedidos.value = pedidos.value.filter((p) => p.id !== pedido.id)
    if (pedidoSelecionado.value && pedidoSelecionado.value.id === pedido.id) {
      fecharDetalhes()
    }
  } catch (erro) {
    console.error(erro)
    alert('Não foi possível excluir o pedido.')
  }
}

const buscarPedidos = async () => {
  try {
    carregando.value = true
    const resposta = await api.get('/orders/')
    pedidos.value = resposta.data.results || resposta.data
  } catch (erro) {
    console.error(erro)
  } finally {
    carregando.value = false
  }
}

const pedidosFiltrados = computed(() => {
  let resultado = pedidos.value

  if (busca.value) {
    const q = busca.value.toLowerCase()
    resultado = resultado.filter((p) => {
      const idMatch = String(p.id).toLowerCase().includes(q)
      const nomeMatch = (p.customer_name || p.cliente_nome || '').toLowerCase().includes(q)
      return idMatch || nomeMatch
    })
  }

  if (filtroStatus.value) {
    resultado = resultado.filter((p) => {
      const s = String(p.status).toLowerCase()
      return (
        s === filtroStatus.value.toLowerCase() ||
        (filtroStatus.value === 'paid' && (s === 'pago' || s === 'confirmed' || s === 'paid')) ||
        (filtroStatus.value === 'pending' && (s === 'pendente' || s === 'aguardando' || s === 'pending')) ||
        (filtroStatus.value === 'shipped' && (s === 'enviado' || s === 'shipped')) ||
        (filtroStatus.value === 'delivered' && (s === 'entregue' || s === 'delivered'))
      )
    })
  }

  return resultado
})

const obterClasseStatus = (status) => {
  const s = String(status).toLowerCase()
  if (s === 'paid' || s === 'pago' || s === 'confirmed') return 'status-paid'
  if (s === 'shipped' || s === 'enviado') return 'status-shipped'
  if (s === 'delivered' || s === 'entregue') return 'status-delivered'
  return 'status-pending'
}

const obterTextoStatus = (status) => {
  const s = String(status).toLowerCase()
  if (s === 'paid' || s === 'pago' || s === 'confirmed') return 'Pago'
  if (s === 'shipped' || s === 'enviado') return 'Enviado'
  if (s === 'delivered' || s === 'entregue') return 'Entregue'
  if (s === 'canceled' || s === 'cancelado') return 'Cancelado'
  return 'Aguardando Pagamento'
}

onMounted(() => {
  buscarPedidos()
})
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
  min-width: 900px;
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
  font-weight: 600;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-family: monospace;
}

.produtos-cell {
  display: flex;
  flex-direction: column;
  max-width: 260px;
  cursor: help;
}

.produtos-nome {
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.92rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.produtos-qtd {
  font-size: 0.78rem;
  color: var(--text-muted);
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

.actions-cell {
  display: flex;
  gap: 0.5rem;
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

.btn-delete:hover {
  background-color: #ef4444;
  border-color: #ef4444;
  color: #ffffff;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background-color: var(--surface-color);
  width: 100%;
  max-width: 680px;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-main);
  font-weight: 800;
}

.close-modal {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
}

.close-modal:hover { color: #ef4444; }
.close-modal svg { width: 1.5rem; height: 1.5rem; }

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.detail-uuid {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.detail-section h3 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: var(--text-main);
  font-weight: 800;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
}

.detail-grid > div {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.detail-value {
  font-size: 0.9rem;
  color: var(--text-main);
  font-weight: 600;
}

.detail-text {
  margin: 0 0 0.35rem 0;
  font-size: 0.9rem;
  color: var(--text-main);
}

.detail-items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.detail-items-table th {
  text-align: left;
  padding: 0.5rem 0.5rem;
  color: var(--text-muted);
  font-weight: 700;
  border-bottom: 1px solid var(--border-color);
}

.detail-items-table td {
  padding: 0.6rem 0.5rem;
  color: var(--text-main);
  border-bottom: 1px dashed var(--border-color);
}

.detail-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 1rem;
}

.detail-total strong {
  color: var(--primary-dark);
  font-size: 1.2rem;
}
</style>