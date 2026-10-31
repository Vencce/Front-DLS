<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()
const totalProdutos = ref(0)
const totalPedidos = ref(0)
const carregando = ref(true)

const loja = {
  nome: 'DLS Auto Peças',
  email: 'contato@dlsautopecas.com.br',
  endereco: 'Rua São Paulo, 3339, Itaum — Joinville, SC, 89210-001',
}

const integracoes = [
  {
    nome: 'Asaas',
    papel: 'Pagamentos (PIX, boleto e cartão)',
    detalhe: 'O cliente é direcionado para a página de pagamento do Asaas. A confirmação chega automaticamente e dá baixa no estoque.',
  },
  {
    nome: 'SuperFrete',
    papel: 'Cálculo de frete (PAC e SEDEX)',
    detalhe: 'O frete é calculado no momento da compra, a partir do peso e das medidas cadastradas em cada peça.',
  },
  {
    nome: 'Cloudinary',
    papel: 'Armazenamento das fotos',
    detalhe: 'As imagens enviadas no cadastro de produtos ficam hospedadas automaticamente.',
  },
]

const carregarResumo = async () => {
  try {
    const [prod, ped] = await Promise.all([
      api.get('/products/', { params: { page_size: 1 } }),
      api.get('/orders/', { params: { page_size: 1 } }),
    ])
    totalProdutos.value = prod.data.count ?? 0
    totalPedidos.value = ped.data.count ?? 0
  } catch (error) {
    console.error(error)
  } finally {
    carregando.value = false
  }
}

onMounted(carregarResumo)
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Configurações</h1>
        <p class="page-subtitle">Informações da loja e serviços conectados.</p>
      </div>
    </div>

    <section class="panel">
      <div class="panel-header">
        <h2>Dados da loja</h2>
      </div>
      <div class="panel-body">
        <div class="info-row">
          <span class="rotulo">Nome</span>
          <span class="valor">{{ loja.nome }}</span>
        </div>
        <div class="info-row">
          <span class="rotulo">E-mail de contato</span>
          <span class="valor">{{ loja.email }}</span>
        </div>
        <div class="info-row">
          <span class="rotulo">Endereço</span>
          <span class="valor">{{ loja.endereco }}</span>
        </div>
        <p class="nota">
          Para alterar estas informações, entre em contato com o responsável técnico.
        </p>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Serviços conectados</h2>
      </div>
      <div class="panel-body">
        <div class="integracao" v-for="item in integracoes" :key="item.nome">
          <div class="integracao-topo">
            <h3>{{ item.nome }}</h3>
            <span class="badge-ativo">Ativo</span>
          </div>
          <p class="papel">{{ item.papel }}</p>
          <p class="detalhe">{{ item.detalhe }}</p>
        </div>
        <p class="nota">
          As credenciais destes serviços ficam no servidor, fora do navegador, por segurança.
        </p>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Resumo</h2>
      </div>
      <div class="panel-body">
        <div v-if="carregando" class="nota">Carregando...</div>
        <template v-else>
          <div class="info-row">
            <span class="rotulo">Produtos cadastrados</span>
            <span class="valor">{{ totalProdutos }}</span>
          </div>
          <div class="info-row">
            <span class="rotulo">Pedidos registrados</span>
            <span class="valor">{{ totalPedidos }}</span>
          </div>
          <div class="info-row">
            <span class="rotulo">Conta em uso</span>
            <span class="valor">{{ authStore.user?.email || authStore.user?.username }}</span>
          </div>
        </template>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>Como manter a loja em dia</h2>
      </div>
      <div class="panel-body">
        <ol class="passos">
          <li>Cadastre cada peça com <strong>peso e medidas reais da embalagem</strong>. Sem isso o frete não é calculado e o cliente não consegue finalizar a compra.</li>
          <li>Confira o estoque ao receber um pedido. A baixa é automática após o pagamento.</li>
          <li>Peças acima de 30 kg não têm frete automático pelos Correios. Nesses casos, combine a entrega pelo WhatsApp.</li>
          <li>Para tirar uma peça da loja sem apagar o histórico, deixe o estoque em zero.</li>
        </ol>
      </div>
    </section>
  </div>
</template>

<style scoped>
.settings-page { display: flex; flex-direction: column; gap: 1.5rem; }

.page-header { display: flex; justify-content: space-between; align-items: flex-end; }
.page-title {
  font-size: 2rem; color: var(--text-main); margin: 0 0 0.25rem 0;
  font-weight: 800; letter-spacing: -0.02em;
}
.page-subtitle { color: var(--text-muted); margin: 0; font-weight: 500; }

.panel {
  background-color: var(--surface-color); border: 1px solid var(--border-color);
  border-radius: 1rem; overflow: hidden; box-shadow: var(--shadow-sm);
}

.panel-header {
  padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color);
  background-color: var(--surface-hover);
}
.panel-header h2 { font-size: 1.125rem; margin: 0; color: var(--text-main); font-weight: 800; }

.panel-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

.info-row {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 1rem; flex-wrap: wrap;
  padding-bottom: 0.75rem; border-bottom: 1px dashed var(--border-color);
}
.info-row:last-of-type { border-bottom: none; padding-bottom: 0; }

.rotulo { color: var(--text-muted); font-size: 0.9rem; font-weight: 600; }
.valor { color: var(--text-main); font-weight: 700; text-align: right; }

.integracao {
  padding: 1rem; border: 1px solid var(--border-color); border-radius: 0.75rem;
  background-color: var(--bg-color);
}
.integracao-topo {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; margin-bottom: 0.5rem;
}
.integracao h3 { margin: 0; font-size: 1rem; color: var(--text-main); font-weight: 800; }

.badge-ativo {
  background-color: rgba(0, 168, 89, 0.15); color: var(--primary-light);
  padding: 0.2rem 0.7rem; border-radius: 999px;
  font-size: 0.75rem; font-weight: 700; white-space: nowrap;
}

.papel { margin: 0 0 0.35rem 0; color: var(--text-main); font-size: 0.9rem; font-weight: 600; }
.detalhe { margin: 0; color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; }

.nota { margin: 0; color: var(--text-muted); font-size: 0.85rem; font-style: italic; }

.passos { margin: 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.passos li { color: var(--text-main); font-size: 0.92rem; line-height: 1.6; }
.passos strong { font-weight: 800; }
</style>