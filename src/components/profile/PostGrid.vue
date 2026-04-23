<template>
  <div class="post-grid">
    <RouterLink
      v-for="post in posts"
      :key="post.id"
      :to="`/posts/${post.id}`"
      class="post-grid__item"
    >
      <img
        :src="post.image_url"
        :alt="post.caption || 'Post'"
        class="post-grid__img"
        loading="lazy"
      />
      <div class="post-grid__overlay">
        <span class="post-grid__stat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {{ post.likes_count ?? 0 }}
        </span>
        <span class="post-grid__stat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {{ post.comments_count ?? 0 }}
        </span>
      </div>
    </RouterLink>

    <div v-if="posts.length === 0 && !loading" class="post-grid__empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
      <p>Nenhuma publicação ainda</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  posts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
</script>

<style scoped>
.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}

.post-grid__item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-surface-alt);
}

.post-grid__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.post-grid__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.post-grid__item:hover .post-grid__overlay {
  opacity: 1;
}

.post-grid__item:hover .post-grid__img {
  transform: scale(1.04);
}

.post-grid__stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.post-grid__empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--color-text-muted);
  font-size: 14px;
}
</style>
