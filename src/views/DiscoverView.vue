<template>
  <div class="discover-view">
    <div class="discover-header">
      <h1 class="discover-header__title">Explorar</h1>
      <div class="search-bar" :class="{ 'search-bar--active': searchFocused }">
        <span class="search-bar__icon">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </span>

        <input
          ref="inputRef"
          v-model="termo"
          type="text"
          class="search-bar__input"
          placeholder="Buscar por nome ou @usuário…"
          autocomplete="off"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
          @input="onInput"
        />


        <button
          v-if="termo"
          class="search-bar__clear"
          @click="limpar"
          aria-label="Limpar busca"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>


    <div class="discover-body">


      <div v-if="loading" class="state-empty">
        <div class="spinner"></div>
        <p>{{ termo ? 'Buscando…' : 'Carregando pessoas…' }}</p>
      </div>


      <div v-else-if="termo && listaExibida.length === 0" class="state-empty">
        <div class="state-empty__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <p class="state-empty__title">Nenhum resultado para</p>
        <p class="state-empty__term">"{{ termo }}"</p>
      </div>


      <div v-else-if="!termo && listaExibida.length === 0 && !loading" class="state-empty">
        <div class="state-empty__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
        <p class="state-empty__title">Você já segue todo mundo!</p>
      </div>


      <template v-else>


        <div class="list-header">
          <span v-if="termo" class="list-header__label">
            Resultados para <strong>"{{ termo }}"</strong>
            <em>({{ listaExibida.length }})</em>
          </span>
          <span v-else class="list-header__label">
            Pessoas para conhecer
            <em>({{ listaExibida.length }})</em>
          </span>
        </div>


        <div class="user-list">
          <UserCard
            v-for="user in listaExibida"
            :key="user.id"
            :user="user"
            :is-following="followingIds.has(user.id)"
            @follow-toggled="onFollowToggled"
          />
        </div>

      </template>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api            from '@/services/api.js'
import { useAuthStore } from '@/stores/auth.js'
import UserCard       from '@/components/discover/UserCard.vue'

const auth = useAuthStore()

const termo         = ref('')
const searchFocused = ref(false)
const loading       = ref(false)

const todosNaoSeguidos = ref([])

const resultadosBusca  = ref([])

const followingIds     = ref(new Set())

let buscaTimeout = null

const listaExibida = computed(() => {
  if (!termo.value.trim()) return todosNaoSeguidos.value


  return resultadosBusca.value.filter(u => u.id !== auth.user?.id)
})

onMounted(async () => {
  loading.value = true
  try {

    const [sugResp, followResp] = await Promise.allSettled([
      api.get('/users/suggestions'),
      auth.user ? api.get(`/users/${auth.user.id}/following`) : Promise.resolve(null),
    ])


    if (sugResp.status === 'fulfilled') {
      const raw = sugResp.value.data?.data ?? sugResp.value.data ?? []
      todosNaoSeguidos.value = Array.isArray(raw)
        ? raw.filter(u => u.id !== auth.user?.id)
        : []
    }


    if (followResp.status === 'fulfilled' && followResp.value) {
      const raw = followResp.value.data?.data ?? followResp.value.data ?? []
      followingIds.value = new Set(Array.isArray(raw) ? raw.map(u => u.id) : [])
    }
  } catch {
    todosNaoSeguidos.value = []
  } finally {
    loading.value = false
  }
})

function onInput() {
  clearTimeout(buscaTimeout)
  resultadosBusca.value = []

  if (!termo.value.trim()) return

  loading.value = true

  buscaTimeout = setTimeout(async () => {
    try {
      const { data } = await api.get('/users/search', {
        params: { q: termo.value.trim() },
      })
      resultadosBusca.value = data?.data ?? data ?? []
    } catch {
      resultadosBusca.value = []
    } finally {
      loading.value = false
    }
  }, 380)
}

function limpar() {
  termo.value           = ''
  resultadosBusca.value = []
}

function onFollowToggled(userId, isNowFollowing) {
  if (isNowFollowing) {
    followingIds.value = new Set([...followingIds.value, userId])

    todosNaoSeguidos.value = todosNaoSeguidos.value.filter(u => u.id !== userId)
  } else {
    followingIds.value = new Set([...followingIds.value].filter(id => id !== userId))
  }
}
</script>

<style scoped>

.discover-view {
  max-width: 620px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.discover-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--color-bg);
  padding: 20px 20px 12px;
  border-bottom: 1px solid var(--color-border);
}

.discover-header__title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--color-text);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-surface-alt);
  border: 1.5px solid var(--color-border);
  border-radius: 14px;
  padding: 10px 16px;
  transition: border-color var(--transition-fast), background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.search-bar--active {
  border-color: var(--color-accent);
  background: var(--color-surface);
  box-shadow: 0 0 0 3px rgba(225, 48, 108, 0.08);
}

.search-bar__icon {
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition: color var(--transition-fast);
}

.search-bar--active .search-bar__icon {
  color: var(--color-accent);
}

.search-bar__input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  color: var(--color-text);
  min-width: 0;
}

.search-bar__input::placeholder {
  color: var(--color-text-muted);
}

.search-bar__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  padding: 2px;
  border-radius: 50%;
  transition: color var(--transition-fast), background var(--transition-fast);
  flex-shrink: 0;
}

.search-bar__clear:hover {
  color: var(--color-text);
  background: var(--color-surface-alt);
}

.discover-body {
  padding: 12px 8px 0;
}

.list-header {
  padding: 8px 12px 4px;
}

.list-header__label {
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.list-header__label strong {
  color: var(--color-text);
  font-weight: 600;
}

.list-header__label em {
  font-style: normal;
  color: var(--color-text-muted);
  margin-left: 4px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 64px 24px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
}

.state-empty__icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-surface-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.state-empty__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.state-empty__term {
  font-size: 13px;
  color: var(--color-text-muted);
}

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