<template>
  <div class="discover-view">
    <div class="discover-view__container">
      <h1 class="discover-view__title">Descubra pessoas</h1>
      <p class="discover-view__subtitle">Sugestões de perfis para você seguir</p>

      <!-- Loading -->
      <div v-if="loading && users.length === 0" class="discover-view__loader">
        <div class="spinner"></div>
      </div>

      <!-- Grid de cards -->
      <div v-else class="discover-view__grid">
        <UserCard
          v-for="user in users"
          :key="user.id"
          :user="user"
          :is-following="followingSet.has(user.id)"
          @follow-toggled="onFollowToggled"
        />
      </div>

      <!-- Vazio -->
      <div v-if="!loading && users.length === 0" class="discover-view__empty">
        <p>Nenhuma sugestão disponível no momento.</p>
      </div>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="discover-view__pagination">
        <button
          class="discover-view__page-btn"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          ← Anterior
        </button>
        <span class="discover-view__page-info">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          class="discover-view__page-btn"
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Próxima →
        </button>
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
const users = ref([])
const followingSet = ref(new Set())
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

async function fetchSuggestions(page = 1) {
  loading.value = true
  try {
    const { data } = await api.get('/users/suggestions', { params: { page } })
    users.value = data.data ?? data ?? []
    currentPage.value = data.current_page ?? page
    totalPages.value = data.last_page ?? 1
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

async function fetchFollowing() {
  if (!auth.user) return
  try {
    const { data } = await api.get(`/users/${auth.user.id}/following`)
    const list = data.data ?? data ?? []
    followingSet.value = new Set(list.map((u) => u.id))
  } catch {
    // silenciado
  }
}

function onFollowToggled(userId, isNowFollowing) {
  if (isNowFollowing) {
    followingSet.value.add(userId)
  } else {
    followingSet.value.delete(userId)
  }
}

function goToPage(page) {
  fetchSuggestions(page)
}

onMounted(async () => {
  await Promise.all([fetchSuggestions(), fetchFollowing()])
})
</script>

<style scoped>
.discover-view {
  padding: 24px 16px;
}

.discover-view__container {
  max-width: 600px;
  margin: 0 auto;
}

.discover-view__title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.discover-view__subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 24px;
}

.discover-view__loader {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.discover-view__grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.discover-view__empty {
  text-align: center;
  padding: 60px 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

/* Paginação */
.discover-view__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.discover-view__page-btn {
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  border-radius: var(--radius-md);
  color: var(--color-accent);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.discover-view__page-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
}

.discover-view__page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.discover-view__page-info {
  font-size: 13px;
  color: var(--color-text-muted);
  font-weight: 500;
}
</style>
