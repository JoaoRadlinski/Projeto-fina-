<template>
  <div class="notif-view">
    <div class="notif-view__container">
      <div class="notif-view__header">
        <h1 class="notif-view__title">Notificações</h1>
        <button
          v-if="notifications.length > 0"
          class="notif-view__mark-all"
          @click="markAllRead"
          :disabled="markingRead"
        >
          Marcar tudo como lido
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading && notifications.length === 0" class="notif-view__loader">
        <div class="spinner"></div>
      </div>

      <!-- Vazio -->
      <div v-else-if="!loading && notifications.length === 0" class="notif-view__empty">
        <div class="notif-view__empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </div>
        <p>Nenhuma notificação ainda.</p>
      </div>

      <!-- Lista -->
      <div v-else class="notif-view__list">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="notif-item"
          :class="{ 'notif-item--unread': !notif.read_at }"
          @click="handleNotifClick(notif)"
        >
          <AppAvatar
            :src="notif.data?.user?.avatar_url"
            :name="notif.data?.user?.name || notif.data?.user_name"
            size="md"
          />
          <div class="notif-item__body">
            <p class="notif-item__text">
              <strong>{{ notif.data?.user?.username || notif.data?.user_name || 'Alguém' }}</strong>
              {{ getNotifMessage(notif) }}
            </p>
            <span class="notif-item__time">{{ formatTime(notif.created_at) }}</span>
          </div>
          <span v-if="!notif.read_at" class="notif-item__dot"></span>
        </div>
      </div>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="notif-view__pagination">
        <button
          class="notif-view__page-btn"
          :disabled="currentPage <= 1"
          @click="loadPage(currentPage - 1)"
        >
          ← Anterior
        </button>
        <span class="notif-view__page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="notif-view__page-btn"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useRelativeTime } from '@/composable/useRelativeTime'
import AppAvatar from '@/components/shared/AppAvatar.vue'

const router = useRouter()
const notifications = ref([])
const loading = ref(false)
const markingRead = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

function formatTime(dateStr) {
  return useRelativeTime(dateStr)
}

function getNotifMessage(notif) {
  const type = notif.type || notif.data?.type || ''
  if (type.includes('like') || type.includes('Like')) return 'curtiu seu post.'
  if (type.includes('comment') || type.includes('Comment')) return 'comentou no seu post.'
  if (type.includes('follow') || type.includes('Follow')) return 'começou a seguir você.'
  return 'interagiu com você.'
}

function handleNotifClick(notif) {
  const data = notif.data || {}
  if (data.post_id) {
    router.push(`/posts/${data.post_id}`)
  } else if (data.user?.username) {
    router.push(`/perfil?user=${data.user.username}`)
  }
}

async function loadPage(page = 1) {
  loading.value = true
  try {
    const { data } = await api.get('/notifications', { params: { page } })
    notifications.value = data.data ?? data ?? []
    currentPage.value = data.current_page ?? page
    totalPages.value = data.last_page ?? 1
  } catch {
    notifications.value = []
  } finally {
    loading.value = false
  }
}

async function markAllRead() {
  markingRead.value = true
  try {
    await api.put('/notifications/read')
    notifications.value.forEach((n) => { n.read_at = new Date().toISOString() })
  } catch {
    // silenciado
  } finally {
    markingRead.value = false
  }
}

onMounted(() => {
  loadPage()
})
</script>

<style scoped>
.notif-view {
  padding: 24px 16px;
}

.notif-view__container {
  max-width: 520px;
  margin: 0 auto;
}

.notif-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.notif-view__title {
  font-size: 22px;
  font-weight: 700;
}

.notif-view__mark-all {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-accent);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.notif-view__mark-all:hover {
  background: rgba(225, 48, 108, 0.06);
}

.notif-view__mark-all:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.notif-view__loader {
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

.notif-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.notif-view__empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-surface-alt);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Lista */
.notif-view__list {
  display: flex;
  flex-direction: column;
}

.notif-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.notif-item:hover {
  background: var(--color-surface-alt);
}

.notif-item--unread {
  background: rgba(225, 48, 108, 0.03);
}

.notif-item__body {
  flex: 1;
  min-width: 0;
}

.notif-item__text {
  font-size: 13px;
  line-height: 1.4;
}

.notif-item__text strong {
  font-weight: 600;
}

.notif-item__time {
  font-size: 11px;
  color: var(--color-text-muted);
}

.notif-item__dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
}

/* Paginação */
.notif-view__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.notif-view__page-btn {
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

.notif-view__page-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
}

.notif-view__page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.notif-view__page-info {
  font-size: 13px;
  color: var(--color-text-muted);
  font-weight: 500;
}
</style>
