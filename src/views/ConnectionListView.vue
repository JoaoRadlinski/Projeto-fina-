<template>
  <div class="connections-view">
    <div class="connections-view__container">


      <div class="connections-view__header">
        <button class="connections-view__back" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 class="connections-view__title">{{ isFollowers ? 'Seguidores' : 'Seguindo' }}</h1>
      </div>

      <div v-if="loading && users.length === 0" class="connections-view__loader">
        <div class="spinner"></div>
      </div>

      <ConnectionList
        v-else
        :users="users"
        :following-ids="followingIds"
        :loading="loading"
        @follow-toggled="onFollowToggled"
      />


      <div v-if="totalPages > 1" class="connections-view__pagination">
        <button
          class="connections-view__page-btn"
          :disabled="currentPage <= 1"
          @click="loadPage(currentPage - 1)"
        >
          ← Anterior
        </button>
        <span class="connections-view__page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="connections-view__page-btn"
          :disabled="currentPage >= totalPages"
          @click="loadPage(currentPage + 1)"
        >
          Próxima →
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import ConnectionList from '@/components/profile/ConnectionList.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const users = ref([])
const followingIds = ref(new Set())
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const targetUserId = ref(null)

const isFollowers = computed(() => route.params.type === 'seguidores')

async function resolveUser() {
  const username = route.query.user || auth.user?.username
  if (!username) return
  try {
    const { data } = await api.get(`/users/${username}`)
    targetUserId.value = (data.data ?? data).id
  } catch {
    targetUserId.value = null
  }
}

async function loadPage(page = 1) {
  if (!targetUserId.value) return
  loading.value = true
  try {
    const endpoint = isFollowers.value
      ? `/users/${targetUserId.value}/followers`
      : `/users/${targetUserId.value}/following`
    const { data } = await api.get(endpoint, { params: { page } })
    users.value = data.data ?? data ?? []
    currentPage.value = data.current_page ?? page
    totalPages.value = data.last_page ?? 1
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

async function loadMyFollowing() {
  if (!auth.user) return
  try {
    const { data } = await api.get(`/users/${auth.user.id}/following`)
    followingIds.value = new Set((data.data ?? data ?? []).map((u) => u.id))
  } catch {  }
}

function onFollowToggled(userId, isNowFollowing) {
  if (isNowFollowing) followingIds.value.add(userId)
  else followingIds.value.delete(userId)
}

function goBack() {
  const u = route.query.user
  router.push(u ? `/perfil?user=${u}` : '/perfil')
}

watch(() => [route.params.type, route.query.user], async () => {
  await resolveUser()
  await loadPage(1)
})

onMounted(async () => {
  await resolveUser()
  await Promise.all([loadPage(1), loadMyFollowing()])
})
</script>

<style scoped>
.connections-view {
  padding: 20px 16px;
}

.connections-view__container {
  max-width: 480px;
  margin: 0 auto;
}

.connections-view__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.connections-view__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.connections-view__back:hover {
  background: var(--color-surface-alt);
}

.connections-view__title {
  font-size: 18px;
  font-weight: 700;
}

.connections-view__loader {
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

.connections-view__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.connections-view__page-btn {
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

.connections-view__page-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
}

.connections-view__page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.connections-view__page-info {
  font-size: 13px;
  color: var(--color-text-muted);
  font-weight: 500;
}
</style>