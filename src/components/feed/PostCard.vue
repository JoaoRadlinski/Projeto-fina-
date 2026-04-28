<template>
  <article class="post-card">

    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <header class="post-card__header">
      <RouterLink :to="authorLink" class="post-card__author">
        <AppAvatar :src="post.user?.avatar_url" :name="post.user?.name" size="md" :show-gradient="true" />
        <div class="post-card__author-info">
          <span class="post-card__username">{{ post.user?.username }}</span>
        </div>
      </RouterLink>

      <!-- Três pontos (menu de opções) -->
      <button class="post-card__more-btn" aria-label="Mais opções" @click="toggleMenu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5"  r="1.5"/>
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>

      <!-- Dropdown de opções (só para o autor) -->
      <Transition name="menu-fade">
        <div v-if="menuOpen && isAuthor" class="post-card__menu">
          <button class="post-card__menu-item post-card__menu-item--danger" @click="handleDelete">
            Excluir publicação
          </button>
        </div>
      </Transition>
    </header>

    <!-- ── Imagem (duplo clique para curtir) ──────────────────────────── -->
    <div
      class="post-card__image-wrapper"
      @dblclick="handleDoubleTap"
      @click="handleSingleTap"
    >
      <img
        :src="post.image_url"
        :alt="post.caption || 'Post'"
        class="post-card__image"
        loading="lazy"
      />

      <!-- Coração animado do duplo clique -->
      <Transition name="heart-burst">
        <div v-if="showHeartOverlay" class="post-card__heart-overlay" aria-hidden="true">
          <svg width="90" height="90" viewBox="0 0 24 24"
               fill="white" stroke="white" stroke-width="0.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      </Transition>
    </div>

    <!-- ── Ações ───────────────────────────────────────────────────────── -->
    <div class="post-card__body">
      <div class="post-card__actions">

        <!-- Grupo esquerdo: curtir + comentar + enviar -->
        <div class="post-card__actions-left">

          <!-- Curtir -->
          <button
            class="post-card__action-btn"
            :class="{ 'post-card__action-btn--liked': post.is_liked }"
            :disabled="feedStore.isLikePending(post.id)"
            :aria-label="post.is_liked ? 'Descurtir' : 'Curtir'"
            @click="handleLike"
          >
            <svg width="24" height="24" viewBox="0 0 24 24"
              :fill="post.is_liked ? 'var(--color-like)' : 'none'"
              :stroke="post.is_liked ? 'var(--color-like)' : 'currentColor'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <!-- Comentar -->
          <RouterLink :to="`/posts/${post.id}`" class="post-card__action-btn" aria-label="Comentar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </RouterLink>

          <!-- Enviar / compartilhar -->
          <button class="post-card__action-btn" aria-label="Enviar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <!-- Bookmark (salvar) — direita -->
        <button
          class="post-card__action-btn post-card__action-btn--bookmark"
          :class="{ 'post-card__action-btn--saved': isSaved }"
          :aria-label="isSaved ? 'Remover dos salvos' : 'Salvar'"
          @click="isSaved = !isSaved"
        >
          <svg width="24" height="24" viewBox="0 0 24 24"
            :fill="isSaved ? 'currentColor' : 'none'"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      <!-- Curtidas -->
      <p class="post-card__likes">
        {{ post.likes_count ?? 0 }} curtida{{ (post.likes_count ?? 0) !== 1 ? 's' : '' }}
      </p>

      <!-- Legenda -->
      <p v-if="post.caption" class="post-card__caption">
        <RouterLink :to="authorLink" class="post-card__caption-author">{{ post.user?.username }}</RouterLink>
        {{ post.caption }}
      </p>

      <!-- Link para comentários -->
      <RouterLink
        v-if="(post.comments_count ?? 0) > 0"
        :to="`/posts/${post.id}`"
        class="post-card__comments-link"
      >
        Ver {{ post.comments_count }} comentário{{ post.comments_count !== 1 ? 's' : '' }}
      </RouterLink>

      <!-- Input de comentário -->
      <CommentInput @submitted="handleComment" />

      <!-- Timestamp -->
      <span class="post-card__time">{{ relativeTime }}</span>
    </div>

  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRelativeTime } from '@/composable/useRelativeTime.js'
import { useFeedStore }    from '@/stores/feed.js'
import { useAuthStore }    from '@/stores/auth.js'
import AppAvatar           from '@/components/shared/AppAvatar.vue'
import CommentInput        from '@/components/feed/CommentInput.vue'

const props = defineProps({
  post: { type: Object, required: true },
})

const feedStore    = useFeedStore()
const auth         = useAuthStore()
const relativeTime = computed(() => useRelativeTime(props.post.created_at))
const authorLink   = computed(() => {
  const u = props.post.user?.username
  return u ? `/perfil?user=${u}` : '/perfil'
})
const isAuthor = computed(() => auth.user?.id === props.post.user?.id)

// ── Menu de opções ───────────────────────────────────────────────────────
const menuOpen = ref(false)
function toggleMenu() { menuOpen.value = !menuOpen.value }

async function handleDelete() {
  menuOpen.value = false
  if (!confirm('Excluir esta publicação?')) return
  try {
    await feedStore.deletePost(props.post.id)
  } catch { /* silenciado */ }
}

// ── Curtida ──────────────────────────────────────────────────────────────
function handleLike() {
  feedStore.toggleLike(props.post.id)
}

// ── Duplo clique para curtir ─────────────────────────────────────────────
const showHeartOverlay = ref(false)
let lastTapTime = 0

function handleSingleTap() {
  // rastreia tempo para detectar duplo toque (mobile)
  lastTapTime = Date.now()
}

function handleDoubleTap() {
  // dispara no dblclick do desktop
  triggerHeartAnimation()
  if (!props.post.is_liked) handleLike()
}

function triggerHeartAnimation() {
  showHeartOverlay.value = true
  setTimeout(() => { showHeartOverlay.value = false }, 900)
}

// ── Salvar (bookmark — apenas local por enquanto) ───────────────────────
const isSaved = ref(false)

// ── Comentário ───────────────────────────────────────────────────────────
async function handleComment(body) {
  try {
    await feedStore.addComment(props.post.id, body)
  } catch { /* silenciado */ }
}
</script>

<style scoped>
/* ── Card ─────────────────────────────────────────────────────────────── */
.post-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  /* Instagram: sem border-radius no desktop */
  border-radius: 0;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
}

/* Pequeno raio somente em mobile para ficar mais moderno */
@media (max-width: 767px) {
  .post-card { border-radius: 0; border-left: none; border-right: none; }
}

/* ── Header ─────────────────────────────────────────────────────────────  */
.post-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  position: relative;
}

.post-card__author {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--color-text);
  flex: 1;
  min-width: 0;
}

.post-card__author-info { display: flex; flex-direction: column; min-width: 0; }
.post-card__username { font-size: 13.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Botão ••• */
.post-card__more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--color-text);
  flex-shrink: 0;
  transition: background var(--transition-fast);
}
.post-card__more-btn:hover { background: var(--color-surface-alt); }

/* Dropdown menu */
.post-card__menu {
  position: absolute;
  top: 44px;
  right: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: var(--shadow-md);
  z-index: 50;
  min-width: 180px;
  overflow: hidden;
}

.post-card__menu-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  transition: background var(--transition-fast);
}
.post-card__menu-item:hover { background: var(--color-surface-alt); }
.post-card__menu-item--danger { color: var(--color-error); font-weight: 700; }

/* Animação do menu */
.menu-fade-enter-active, .menu-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.menu-fade-enter-from, .menu-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Imagem ──────────────────────────────────────────────────────────── */
.post-card__image-wrapper {
  width: 100%;
  background: var(--color-surface-alt);
  position: relative;
  cursor: pointer;
  user-select: none;
}

.post-card__image {
  width: 100%;
  display: block;
  object-fit: cover;
  max-height: 585px; /* Instagram limita ~1:1.25 */
}

/* Coração do duplo clique */
.post-card__heart-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.heart-burst-enter-active {
  animation: heart-burst 0.9s ease forwards;
}
.heart-burst-leave-active {
  transition: opacity 0.15s ease;
}
.heart-burst-leave-to { opacity: 0; }

@keyframes heart-burst {
  0%   { transform: scale(0.3); opacity: 0; }
  20%  { transform: scale(1.2); opacity: 1; }
  40%  { transform: scale(0.95); }
  60%  { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1);   opacity: 0; }
}

/* ── Body (ações + info) ─────────────────────────────────────────────── */
.post-card__body { padding: 8px 12px 12px; }

.post-card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.post-card__actions-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Botões de ação */
.post-card__action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text);
  padding: 4px;
  transition: transform var(--transition-fast), opacity var(--transition-fast);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 50%;
}

.post-card__action-btn:hover { transform: scale(1.1); }
.post-card__action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Curtido — animação de pop */
.post-card__action-btn--liked { animation: like-pop 0.35s ease; }
@keyframes like-pop {
  0%   { transform: scale(1); }
  25%  { transform: scale(1.35); }
  50%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}

/* Bookmark alinhado à direita */
.post-card__action-btn--bookmark { margin-left: auto; }

/* ── Texto do post ───────────────────────────────────────────────────── */
.post-card__likes {
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 4px;
}

.post-card__caption {
  font-size: 13.5px;
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: 4px;
  word-break: break-word;
}

.post-card__caption-author {
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  margin-right: 4px;
}
.post-card__caption-author:hover { text-decoration: underline; }

.post-card__comments-link {
  display: block;
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: none;
  margin-bottom: 6px;
}
.post-card__comments-link:hover { color: var(--color-text); }

.post-card__time {
  display: block;
  font-size: 10px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 8px;
}
</style>
