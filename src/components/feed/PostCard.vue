<template>
  <article class="post-card">
    <!-- Header -->
    <header class="post-card__header">
      <RouterLink :to="authorLink" class="post-card__author">
        <AppAvatar :src="post.user?.avatar_url" :name="post.user?.name" size="md" />
        <span class="post-card__username">{{ post.user?.username }}</span>
      </RouterLink>
      <span class="post-card__time">{{ relativeTime }}</span>
    </header>

    <!-- Imagem -->
    <div class="post-card__image-wrapper">
      <img
        :src="post.image_url"
        :alt="post.caption || 'Post'"
        class="post-card__image"
        loading="lazy"
      />
    </div>

    <!-- Ações -->
    <div class="post-card__body">
      <div class="post-card__actions">
        <button
          class="post-card__action-btn"
          :class="{ 'post-card__action-btn--liked': post.is_liked }"
          @click="handleLike"
          :aria-label="post.is_liked ? 'Descurtir' : 'Curtir'"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" :fill="post.is_liked ? '#ed4956' : 'none'" :stroke="post.is_liked ? '#ed4956' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <RouterLink :to="`/posts/${post.id}`" class="post-card__action-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </RouterLink>
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

      <!-- Comentário inline -->
      <CommentInput @submitted="handleComment" />
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRelativeTime } from '@/composable/useRelativeTime'
import { useFeedStore } from '@/stores/feed'
import AppAvatar from '@/components/shared/AppAvatar.vue'
import CommentInput from '@/components/feed/CommentInput.vue'

const props = defineProps({
  post: { type: Object, required: true },
})

const feedStore = useFeedStore()

const relativeTime = computed(() => useRelativeTime(props.post.created_at))

const authorLink = computed(() => {
  const username = props.post.user?.username
  return username ? `/perfil?user=${username}` : '/perfil'
})

function handleLike() {
  feedStore.toggleLike(props.post.id)
}

async function handleComment(body) {
  try {
    await feedStore.addComment(props.post.id, body)
  } catch {
    // silenciado — poderia exibir uma notificação
  }
}
</script>

<style scoped>
.post-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 16px;
}

.post-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}

.post-card__author {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--color-text);
}

.post-card__username {
  font-size: 13px;
  font-weight: 600;
}

.post-card__time {
  font-size: 11px;
  color: var(--color-text-muted);
}

/* Imagem */
.post-card__image-wrapper {
  width: 100%;
  background: var(--color-surface-alt);
  position: relative;
}

.post-card__image {
  width: 100%;
  display: block;
  object-fit: cover;
  max-height: 600px;
}

/* Body */
.post-card__body {
  padding: 12px 14px;
}

/* Ações */
.post-card__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.post-card__action-btn {
  display: flex;
  align-items: center;
  color: var(--color-text);
  padding: 2px;
  transition: transform var(--transition-fast);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.post-card__action-btn:hover {
  transform: scale(1.1);
}

.post-card__action-btn--liked {
  animation: like-pop 0.35s ease;
}

@keyframes like-pop {
  0%   { transform: scale(1); }
  25%  { transform: scale(1.3); }
  50%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}

/* Curtidas */
.post-card__likes {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
}

/* Legenda */
.post-card__caption {
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: 4px;
  word-break: break-word;
}

.post-card__caption-author {
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  margin-right: 4px;
}

.post-card__caption-author:hover {
  text-decoration: underline;
}

/* Link para comentários */
.post-card__comments-link {
  display: block;
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: none;
  margin-bottom: 4px;
}

.post-card__comments-link:hover {
  color: var(--color-text);
}
</style>
