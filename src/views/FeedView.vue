<template>
  <div class="feed-view">


    <div class="feed-col">
      <h1 class="sr-only">Feed</h1>


      <div v-if="feedStore.loading && feedStore.orderedPosts.length === 0" class="feed-loader">
        <div class="spinner"></div>
        <p>Carregando seu feed…</p>
      </div>


      <div v-else-if="!feedStore.loading && feedStore.orderedPosts.length === 0" class="feed-empty">
        <div class="feed-empty__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </div>
        <h2 class="feed-empty__title">Seu feed está vazio</h2>
        <p class="feed-empty__text">Siga pessoas ou crie seu primeiro post!</p>
        <div class="feed-empty__actions">
          <RouterLink to="/descobrir" class="feed-empty__btn feed-empty__btn--primary">
            Descobrir pessoas
          </RouterLink>
          <RouterLink to="/criar" class="feed-empty__btn feed-empty__btn--secondary">
            Criar post
          </RouterLink>
        </div>
      </div>


      <template v-else>
        <PostCard
          v-for="post in feedStore.orderedPosts"
          :key="post.id"
          :post="post"
        />


        <div v-if="feedStore.hasMore" class="feed-load-more">
          <button
            class="feed-load-more__btn"
            :disabled="feedStore.loading"
            @click="feedStore.loadMoreFeed()"
          >
            <span v-if="feedStore.loading" class="spinner spinner--sm"></span>
            <span v-else>Mostrar mais posts</span>
          </button>
        </div>
      </template>
    </div>


    <SuggestionsPanel class="feed-suggestions" />

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFeedStore }  from '@/stores/feed.js'
import PostCard          from '@/components/feed/PostCard.vue'
import SuggestionsPanel  from '@/components/feed/SuggestionsPanel.vue'

const feedStore = useFeedStore()

onMounted(() => {
  feedStore.fetchFeed()
})
</script>

<style scoped>

.feed-view {
  display: flex;
  gap: 28px;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  align-items: flex-start;
}

.feed-col {
  flex: 1;
  max-width: 470px;
  min-width: 0;
}

.feed-suggestions {
  display: none;
  margin-left: 80px;
}
@media (min-width: 960px) {
  .feed-suggestions { display: block; }
}

.feed-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.spinner--sm { width: 18px; height: 18px; border-width: 2px; }
@keyframes spin { to { transform: rotate(360deg); } }

.feed-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 24px;
}

.feed-empty__icon {
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

.feed-empty__title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.feed-empty__text  { font-size: 14px; color: var(--color-text-muted); margin-bottom: 24px; }

.feed-empty__actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }

.feed-empty__btn {
  padding: 10px 22px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
.feed-empty__btn--primary {
  background: var(--color-accent);
  color: #fff;
}
.feed-empty__btn--secondary {
  background: var(--color-surface-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.feed-load-more {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.feed-load-more__btn {
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
.feed-load-more__btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(0, 149, 246, 0.04);
}
.feed-load-more__btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>