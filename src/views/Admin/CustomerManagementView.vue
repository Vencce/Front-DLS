<template>
  <div class="admin-customers-page">
    <div class="page-header" v-animate>
      <div>
        <h1 class="page-title">Gestão de Clientes</h1>
        <p class="page-subtitle">Visualize e gerencie a base de clientes da sua loja.</p>
      </div>
      <button class="btn-primary" @click="abrirModalAdd">
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
        <input type="text" v-model="busca" placeholder="Buscar por nome, e-mail ou CPF/CNPJ...">
      </div>
      <div class="status-filters">
        <button class="status-tab" :class="{ active: filtroStatus === '' }" @click="filtroStatus = ''">Todos</button>
        <button class="status-tab" :class="{ active: filtroStatus === 'active' }" @click="filtroStatus = 'active'">Ativos</button>
        <button class="status-tab" :class="{ active: filtroStatus === 'inactive' }" @click="filtroStatus = 'inactive'">Inativos</button>
      </div>
    </div>

    <div v-if="carregando" class="loading-state" style="text-align: center; padding: 2rem;">
      <p>Carregando clientes...</p>
    </div>

    <div v-else class="table-card" v-animate>
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
            <tr v-if="clientesFiltrados.length === 0">
              <td colspan="6" class="empty-state">
                Nenhum cliente encontrado.
              </td>
            </tr>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
              <td>
                <div class="client-cell">
                  <div class="avatar">{{ (cliente.name || cliente.nome || 'C').charAt(0).toUpperCase() }}</div>
                  <div class="client-info">
                    <span class="name">{{ cliente.name || cliente.nome || 'Sem nome' }}</span>
                    <span class="document">{{ cliente.document || cliente.cpf || cliente.cnpj || 'Sem documento' }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="contact-info">
                  <span class="email">{{ cliente.email || 'Sem e-mail' }}</span>
                  <span class="phone">{{ cliente.phone || cliente.telefone || 'Sem telefone' }}</span>
                </div>
              </td>
              <td>{{ formatarData(cliente.registeredAt || cliente.data_cadastro || cliente.created_at) }}</td>
              <td>
                <span class="orders-count">{{ cliente.totalOrders || cliente.total_pedidos || 0 }}</span>
              </td>
              <td>
                <span class="status-badge" :class="(cliente.status === 'active' || cliente.is_active === true || cliente.is_active === undefined) ? 'status-active' : 'status-inactive'">
                  {{ (cliente.status === 'active' || cliente.is_active === true || cliente.is_active === undefined) ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon edit" title="Editar Cliente" @click="abrirModalEdicao(cliente)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button class="btn-icon delete" title="Excluir Cliente" @click="excluirCliente(cliente)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-card">
        <h2>{{ modoModal === 'add' ? 'Adicionar Novo Cliente' : 'Editar Cliente' }}</h2>
        <form @submit.prevent="salvarCliente">
          <div class="form-group">
            <label>Nome Completo</label>
            <input type="text" v-model="clienteAtual.nome" required />
          </div>
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" v-model="clienteAtual.email" :disabled="modoModal === 'edit'" required />
          </div>
          <div class="form-group">
            <label>CPF / CNPJ</label>
            <input type="text" v-model="clienteAtual.cpf" />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="clienteAtual.status">
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="fecharModal">Cancelar</button>
            <button type="submit" class="btn-save">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'

const busca = ref('')
const filtroStatus = ref('')
const clientes = ref([])
const carregando = ref(true)

const mostrarModal = ref(false)
const modoModal = ref('add')
const clienteAtual = ref({ id: '', nome: '', email: '', cpf: '', status: 'active' })

const buscarClientes = async () => {
  try {
    carregando.value = true
    const resposta = await api.get('/customers/')
    clientes.value = resposta.data.results || resposta.data
  } catch (erro) {
    console.error(erro)
  } finally {
    carregando.value = false
  }
}

const formatarData = (stringData) => {
  if (!stringData) return ''
  const data = new Date(stringData)
  if (isNaN(data.getTime())) return stringData
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(data)
}

const clientesFiltrados = computed(() => {
  let resultado = clientes.value

  if (busca.value) {
    const q = busca.value.toLowerCase()
    resultado = resultado.filter(c => {
      const nome = (c.name || c.nome || '').toLowerCase()
      const email = (c.email || '').toLowerCase()
      const documento = (c.document || c.cpf || c.cnpj || '').toLowerCase()
      return nome.includes(q) || email.includes(q) || documento.includes(q)
    })
  }

  if (filtroStatus.value) {
    resultado = resultado.filter(c => {
      const status = c.status || c.is_active || 'active'
      const isActive = status === 'active' || status === true
      if (filtroStatus.value === 'active') return isActive
      if (filtroStatus.value === 'inactive') return !isActive
      return true
    })
  }

  return resultado
})

const abrirModalAdd = () => {
  clienteAtual.value = { id: '', nome: '', email: '', cpf: '', status: 'active' }
  modoModal.value = 'add'
  mostrarModal.value = true
}

const abrirModalEdicao = (cliente) => {
  clienteAtual.value = {
    id: cliente.id,
    nome: cliente.nome || cliente.name || '',
    email: cliente.email || '',
    cpf: cliente.cpf || cliente.document || '',
    status: (cliente.status === 'active' || cliente.is_active === true || cliente.is_active === undefined) ? 'active' : 'inactive'
  }
  modoModal.value = 'edit'
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
}

const salvarCliente = async () => {
  try {
    if (modoModal.value === 'add') {
      await api.post('/customers/', clienteAtual.value)
      alert('Cliente adicionado com sucesso!')
    } else {
      await api.put(`/customers/${clienteAtual.value.id}/`, clienteAtual.value)
      alert('Cliente atualizado com sucesso!')
    }
    fecharModal()
    buscarClientes()
  } catch (erro) {
    console.error(erro)
    alert(erro.response?.data?.erro || 'Erro ao salvar cliente.')
  }
}

const excluirCliente = async (cliente) => {
  const nomeCliente = cliente.nome || cliente.name || 'este cliente'
  if (!confirm(`Tem certeza que deseja excluir ${nomeCliente}?`)) return
  
  try {
    await api.delete(`/customers/${cliente.id}/`)
    alert('Cliente excluído com sucesso!')
    buscarClientes()
  } catch (erro) {
    console.error(erro)
    alert(erro.response?.data?.erro || 'Erro ao excluir cliente.')
  }
}

onMounted(() => {
  buscarClientes()
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

.btn-icon.delete:hover {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.btn-icon svg {
  width: 1.1rem;
  height: 1.1rem;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background-color: var(--surface-color);
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-card h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-main);
  font-weight: 800;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-main);
}

.form-group input, .form-group select {
  padding: 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: var(--bg-color);
  color: var(--text-main);
  outline: none;
}

.form-group input:focus, .form-group select:focus {
  border-color: var(--primary-light);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  color: var(--text-main);
}

.btn-save {
  background-color: var(--primary-light);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-save:hover {
  background-color: var(--primary-hover);
}
</style>