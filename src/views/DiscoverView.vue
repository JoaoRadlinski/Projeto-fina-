<template>
  <div class="pagina">
    <!-- Busca -->
    <div class="busca">
      <div class="campo-busca">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="termo"
          type="text"
          placeholder="Buscar pessoas..."
          @input="buscar"
        />
        <button v-if="termo" class="campo-busca__clear" @click="limparBusca">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Resultados da busca -->
    <div v-if="termo" class="secao">
      <div v-if="buscando" class="estado-vazio">
        <div class="spinner"></div>
      </div>
      <div v-else-if="resultadosBusca.length === 0" class="estado-vazio">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <p>Nenhum usuário encontrado para "{{ termo }}"</p>
      </div>
      <div v-else class="lista-usuarios">
        <UserCard
          v-for="user in resultadosBusca"
          :key="user.id"
          :user="user"
          :is-following="followingIds.has(user.id)"
        />
      </div>
    </div>

    <!-- Sugestões para seguir -->
    <div v-else class="secao">
      <h2 class="secao__titulo">Sugestões para você</h2>

      <div v-if="carregandoSugestoes" class="estado-vazio">
        <div class="spinner"></div>
      </div>

      <div v-else-if="sugestoes.length === 0" class="estado-vazio">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <p>Nenhuma sugestão no momento</p>
      </div>

      <div v-else class="lista-usuarios">
        <UserCard
          v-for="user in sugestoes"
          :key="user.id"
          :user="user"
          :is-following="followingIds.has(user.id)"
          @follow-toggled="onFollowToggled"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import UserCard from '@/components/discover/UserCard.vue'

const auth = useAuthStore()

const termo             = ref('')
const sugestoes         = ref([])
const resultadosBusca   = ref([])
const followingIds      = ref(new Set())
const carregandoSugestoes = ref(false)
const buscando          = ref(false)
let   buscaTimeout      = null

async function carregarSugestoes() {
  carregandoSugestoes.value = true
  try {
    const { data } = await api.get('/users/suggestions')
    sugestoes.value = data.data ?? data ?? []
  } catch {
    sugestoes.value = []
  } finally {
    carregandoSugestoes.value = false
  }
}

async function carregarMeusSeguindo() {
  if (!auth.user) return
  try {
    const { data } = await api.get(`/users/${auth.user.id}/following`)
    followingIds.value = new Set((data.data ?? data ?? []).map((u) => u.id))
  } catch { /* silenciado */ }
}

function buscar() {
  clearTimeout(buscaTimeout)
  if (!termo.value.trim()) {
    resultadosBusca.value = []
    return
  }
  buscando.value = true
  buscaTimeout = setTimeout(async () => {
    try {
      const { data } = await api.get('/users/search', { params: { q: termo.value.trim() } })
      resultadosBusca.value = (data.data ?? data ?? []).filter((u) => u.id !== auth.user?.id)
    } catch {
      resultadosBusca.value = []
    } finally {
      buscando.value = false
    }
  }, 400)
}

function limparBusca() {
  termo.value = ''
  resultadosBusca.value = []
}

function onFollowToggled(userId, isNowFollowing) {
  if (isNowFollowing) followingIds.value = new Set([...followingIds.value, userId])
  else                followingIds.value = new Set([...followingIds.value].filter((id) => id !== userId))
}

onMounted(async () => {
  await Promise.all([carregarSugestoes(), carregarMeusSeguindo()])
})
</script>

<style scoped>
.pagina {
  max-width: 600px;
  margin: 0 auto;
}

/* Campo de busca */
.busca {
  padding: 16px;
  position: sticky;
  top: 0;
  background: var(--color-bg);
  z-index: 10;
  border-bottom: 1px solid var(--color-border);
}

.campo-busca {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-surface-alt);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 10px 14px;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.campo-busca:focus-within {
  border-color: var(--color-accent);
  background: var(--color-surface);
}

.campo-busca svg {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.campo-busca input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  color: var(--color-text);
}

.campo-busca input::placeholder { color: var(--color-text-muted); }

.campo-busca__clear {
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: color var(--transition-fast);
}
.campo-busca__clear:hover { color: var(--color-text); }

/* Seção */
.secao {
  padding: 16px;
}

.secao__titulo {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--color-text);
}

/* Lista de usuários */
.lista-usuarios {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Estado vazio / loading */
.estado-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: center;
}

/* Spinner */
.spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
