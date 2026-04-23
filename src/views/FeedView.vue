<template>
  <div class="feed-view">
    <div class="feed-view__container">
      <h1 class="sr-only">Feed</h1>

      <!-- Estado de carregamento inicial -->
      <div v-if="feedStore.loading && feedStore.orderedPosts.length === 0" class="feed-view__loader">
        <div class="spinner"></div>
        <p>Carregando seu feed…</p>
      </div>

      <!-- Feed vazio -->
      <div v-else-if="!feedStore.loading && feedStore.orderedPosts.length === 0" class="feed-view__empty">
        <div class="feed-view__empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </div>
        <h2 class="feed-view__empty-title">Seu feed está vazio</h2>
        <p class="feed-view__empty-text">
          Comece seguindo pessoas ou crie seu primeiro post!
        </p>
        <div class="feed-view__empty-actions">
          <RouterLink to="/descobrir" class="feed-view__action-btn feed-view__action-btn--primary">
            Descobrir pessoas
          </RouterLink>
          <RouterLink to="/criar" class="feed-view__action-btn feed-view__action-btn--secondary">
            Criar post
          </RouterLink>
        </div>
      </div>

      <!-- Posts -->
      <template v-else>
        <PostCard
          v-for="post in feedStore.orderedPosts"
          :key="post.id"
          :post="post"
        />

        <!-- Carregar mais -->
        <div v-if="feedStore.hasMore" class="feed-view__load-more">
          <button
            class="feed-view__load-more-btn"
            :disabled="feedStore.loading"
            @click="feedStore.loadMoreFeed()"
          >
            <span v-if="feedStore.loading" class="spinner spinner--sm"></span>
            <span v-else>Carregar mais</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFeedStore } from '@/stores/feed'
import PostCard from '@/components/feed/PostCard.vue'

const feedStore = useFeedStore()

onMounted(() => {
  feedStore.fetchFeed()
})
</script>

<style scoped>
.feed-view {
  padding: 20px 16px;
}

.feed-view__container {
  max-width: 470px;
  margin: 0 auto;
}

/* Loader */
.feed-view__loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

/* Spinner */
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.spinner--sm {
  width: 18px;
  height: 18px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Feed vazio */
.feed-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 24px;
}

.feed-view__empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-surface-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  margin-bottom: 20px;
}

.feed-view__empty-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.feed-view__empty-text {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 24px;
  max-width: 260px;
}

.feed-view__empty-actions {
  display: flex;
  gap: 12px;
}

.feed-view__action-btn {
  padding: 10px 22px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.feed-view__action-btn--primary {
  background: linear-gradient(135deg, #405de6, #5851db, #833ab4);
  color: #fff;
  box-shadow: 0 2px 8px rgba(88, 81, 219, 0.3);
}

.feed-view__action-btn--primary:hover {
  box-shadow: 0 4px 16px rgba(88, 81, 219, 0.45);
  transform: translateY(-1px);
}

.feed-view__action-btn--secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1.5px solid var(--color-border);
}

.feed-view__action-btn--secondary:hover {
  background: var(--color-surface-alt);
}

/* Load more */
.feed-view__load-more {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.feed-view__load-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 28px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 140px;
  min-height: 40px;
}

.feed-view__load-more-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(225, 48, 108, 0.04);
}

.feed-view__load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
