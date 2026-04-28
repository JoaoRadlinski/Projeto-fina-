<template>
  <aside class="suggestions-panel">

    <!-- ── Usuário logado ──────────────────────────────────────────────── -->
    <div class="panel-user">
      <RouterLink to="/perfil" class="panel-user__avatar-link">
        <AppAvatar
          :src="auth.user?.avatar_url"
          :name="auth.user?.name"
          size="md"
          :show-gradient="true"
        />
      </RouterLink>
      <div class="panel-user__info">
        <RouterLink to="/perfil" class="panel-user__username">
          {{ auth.user?.username }}
        </RouterLink>
        <span class="panel-user__name">{{ auth.user?.name }}</span>
      </div>
    </div>

    <!-- ── Cabeçalho de sugestões ─────────────────────────────────────── -->
    <div class="panel-section-header">
      <span class="panel-section-title">Sugestões para você</span>
      <RouterLink to="/descobrir" class="panel-section-link">Ver tudo</RouterLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="panel-loading">
      <div class="panel-loading__dot"></div>
      <div class="panel-loading__dot"></div>
      <div class="panel-loading__dot"></div>
    </div>

    <!-- Vazio (sem sugestões) -->
    <p v-else-if="!loading && suggestions.length === 0" class="panel-empty">
      Nenhuma sugestão no momento.
    </p>

    <!-- Lista de sugestões -->
    <ul v-else class="suggestion-list">
      <li
        v-for="user in suggestions"
        :key="user.id"
        class="suggestion-item"
      >
        <RouterLink :to="`/perfil?user=${user.username}`" class="suggestion-item__avatar-link">
          <AppAvatar
            :src="user.avatar_url"
            :name="user.name"
            size="sm"
          />
        </RouterLink>

        <div class="suggestion-item__info">
          <RouterLink :to="`/perfil?user=${user.username}`" class="suggestion-item__username">
            {{ user.username }}
          </RouterLink>
          <span class="suggestion-item__name">{{ user.name }}</span>
        </div>

        <!-- Botão seguir / seguindo -->
        <button
          class="suggestion-item__btn"
          :class="{ 'suggestion-item__btn--following': followsStore.isFollowing(user.id) }"
          :disabled="followsStore.isPending(user.id)"
          @click="toggleFollow(user)"
        >
          <span v-if="followsStore.isPending(user.id)" class="btn-spinner"></span>
          <span v-else-if="followsStore.isFollowing(user.id)">Seguindo</span>
          <span v-else>Seguir</span>
        </button>
      </li>
    </ul>

    <!-- Footer links -->
    <div class="panel-footer">
      <span>© 2025 InstaClone</span>
    </div>

  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore }    from '@/stores/auth.js'
import { useFollowsStore } from '@/stores/follows.js'
import { usersService }    from '@/services/users.service.js'
import AppAvatar           from '@/components/shared/AppAvatar.vue'

const auth        = useAuthStore()
const followsStore = useFollowsStore()

const suggestions = ref([])
const loading     = ref(true)

onMounted(async () => {
  try {
    const { data } = await usersService.suggestions()
    // Suporta { data: [...] } (Resource Collection) ou array direto
    const raw = data?.data ?? data
    suggestions.value = Array.isArray(raw) ? raw : []
  } catch {
    // Se o endpoint não existir, simplesmente fica vazio
    suggestions.value = []
  } finally {
    loading.value = false
  }
})

async function toggleFollow(user) {
  if (followsStore.isFollowing(user.id)) {
    await followsStore.unfollow(user.id)
  } else {
    await followsStore.follow(user.id)
    // Remove da lista após seguir (comportamento Instagram)
    setTimeout(() => {
      suggestions.value = suggestions.value.filter(u => u.id !== user.id)
    }, 600)
  }
}
</script>

<style scoped>
/* ── Painel container ─────────────────────────────────────────────────── */
.suggestions-panel {
  width: 300px;
  flex-shrink: 0;
  padding-top: 20px;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

/* ── Usuário logado ───────────────────────────────────────────────────── */
.panel-user {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.panel-user__avatar-link {
  flex-shrink: 0;
}

.panel-user__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.panel-user__username {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.panel-user__name {
  font-size: 12px;
  color: var(--color-text-muted);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* ── Cabeçalho da seção ───────────────────────────────────────────────── */
.panel-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.panel-section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.panel-section-link {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  transition: opacity 0.15s ease;
}
.panel-section-link:hover { opacity: 0.6; }

/* ── Loading animado ──────────────────────────────────────────────────── */
.panel-loading {
  display: flex;
  gap: 6px;
  padding: 16px 0;
  justify-content: center;
}

.panel-loading__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-border);
  animation: dot-bounce 1.2s ease-in-out infinite;
}
.panel-loading__dot:nth-child(2) { animation-delay: 0.2s; }
.panel-loading__dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
  40%           { transform: scale(1);   opacity: 1; }
}

/* ── Empty state ──────────────────────────────────────────────────────── */
.panel-empty {
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
  padding: 12px 0;
}

/* ── Lista de sugestões ───────────────────────────────────────────────── */
.suggestion-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.suggestion-item__avatar-link { flex-shrink: 0; }

.suggestion-item__info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.suggestion-item__username {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.suggestion-item__username:hover { opacity: 0.7; }

.suggestion-item__name {
  font-size: 11px;
  color: var(--color-text-muted);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* Botão Seguir / Seguindo */
.suggestion-item__btn {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent);
  padding: 4px 0;
  min-width: 52px;
  text-align: right;
  transition: opacity 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.suggestion-item__btn:hover:not(:disabled) { opacity: 0.6; }
.suggestion-item__btn:disabled { cursor: not-allowed; opacity: 0.5; }

.suggestion-item__btn--following {
  color: var(--color-text-muted);
  font-weight: 400;
}

.btn-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1.5px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Footer ───────────────────────────────────────────────────────────── */
.panel-footer {
  margin-top: 20px;
  font-size: 11px;
  color: var(--color-text-muted);
  opacity: 0.6;
}
</style>
