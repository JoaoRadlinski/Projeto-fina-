<template>
  <div class="stories-bar">
    <div class="stories-scroll">

      <!-- Primeiro item: o próprio usuário (para criar conteúdo) -->
      <RouterLink to="/criar" class="story-item story-item--own">
        <div class="story-item__ring story-item__ring--add">
          <div class="story-item__avatar-wrap">
            <AppAvatar
              :src="auth.user?.avatar_url"
              :name="auth.user?.name"
              size="sm"
            />
            <!-- Ícone de "+" -->
            <span class="story-item__add-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                   stroke="white" stroke-width="3" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </span>
          </div>
        </div>
        <span class="story-item__label">Seu perfil</span>
      </RouterLink>

      <!-- Skeleton enquanto carrega -->
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="story-item story-item--skeleton">
          <div class="story-skeleton__ring"></div>
          <div class="story-skeleton__label"></div>
        </div>
      </template>

      <!-- Usuários que você segue -->
      <RouterLink
        v-for="user in following"
        :key="user.id"
        :to="`/perfil?user=${user.username}`"
        class="story-item"
      >
        <div class="story-item__ring">
          <div class="story-item__avatar-wrap">
            <AppAvatar
              :src="user.avatar_url"
              :name="user.name"
              size="sm"
            />
          </div>
        </div>
        <span class="story-item__label">{{ user.username }}</span>
      </RouterLink>

      <!-- Estado vazio (não segue ninguém) -->
      <div v-if="!loading && following.length === 0" class="stories-empty">
        <RouterLink to="/descobrir" class="stories-empty__link">
          Descubra pessoas para seguir →
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore }   from '@/stores/auth.js'
import api                from '@/services/api.js'
import AppAvatar          from '@/components/shared/AppAvatar.vue'

const auth      = useAuthStore()
const following = ref([])
const loading   = ref(true)

onMounted(async () => {
  if (!auth.user?.id) { loading.value = false; return }
  try {
    const { data } = await api.get(`/users/${auth.user.id}/following`)
    const raw = data?.data ?? data ?? []
    following.value = Array.isArray(raw) ? raw : []
  } catch {
    following.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ── Container com scroll horizontal ─────────────────────────────────── */
.stories-bar {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 12px 0;
}

.stories-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 4px 12px;
  scrollbar-width: none;         /* Firefox */
  -ms-overflow-style: none;      /* IE/Edge */
}
.stories-scroll::-webkit-scrollbar { display: none; } /* Chrome/Safari */

/* ── Item de story ────────────────────────────────────────────────────── */
.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  cursor: pointer;
  text-decoration: none;
  color: var(--color-text);
  transition: opacity 0.15s ease;
}
.story-item:hover { opacity: 0.85; }

/* Anel colorido (gradiente Instagram) */
.story-item__ring {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  padding: 2.5px;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  /* Animação sutil no hover */
  transition: transform 0.2s ease;
}
.story-item:hover .story-item__ring { transform: scale(1.05); }

/* Anel do próprio usuário (azul, pois ainda não tem story) */
.story-item--own .story-item__ring {
  background: var(--color-surface-alt);
  border: 2px solid var(--color-border);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Wrap do avatar dentro do anel (fundo branco/preto para separar do anel) */
.story-item__avatar-wrap {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* Anel do próprio usuário */
.story-item--own .story-item__avatar-wrap {
  background: transparent;
  border: none;
}

/* Ícone "+" sobre o avatar do próprio usuário */
.story-item__add-icon {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 18px;
  height: 18px;
  background: var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-surface);
  z-index: 1;
}

/* Label (username truncado) */
.story-item__label {
  font-size: 11px;
  color: var(--color-text);
  max-width: 58px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
.story-item--skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.story-skeleton__ring {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--color-surface-alt);
  animation: shimmer 1.4s ease-in-out infinite;
}

.story-skeleton__label {
  width: 44px;
  height: 9px;
  border-radius: 4px;
  background: var(--color-surface-alt);
  animation: shimmer 1.4s ease-in-out infinite 0.2s;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* ── Estado vazio ─────────────────────────────────────────────────────── */
.stories-empty {
  display: flex;
  align-items: center;
  padding: 0 4px;
}

.stories-empty__link {
  font-size: 12px;
  color: var(--color-accent);
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
}
.stories-empty__link:hover { opacity: 0.7; }
</style>
