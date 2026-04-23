<template>
  <div class="not-found">
    <div class="not-found__content">
      <div class="not-found__icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 15h8"/>
          <path d="M9 9h.01"/>
          <path d="M15 9h.01"/>
        </svg>
      </div>
      <h1 class="not-found__code">404</h1>
      <h2 class="not-found__title">Página não encontrada</h2>
      <p class="not-found__text">
        A página que você está procurando não existe ou foi removida.
      </p>
      <RouterLink :to="isAuthenticated ? '/feed' : '/login'" class="not-found__btn">
        {{ isAuthenticated ? 'Voltar ao feed' : 'Ir para login' }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TOKEN_KEY } from '@/services/api'

const isAuthenticated = computed(() => !!localStorage.getItem(TOKEN_KEY))
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 24px;
}

.not-found__content {
  text-align: center;
  max-width: 360px;
}

.not-found__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--color-surface-alt);
  color: var(--color-text-muted);
  margin-bottom: 24px;
}

.not-found__code {
  font-size: 64px;
  font-weight: 800;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 8px;
}

.not-found__title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.not-found__text {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 28px;
}

.not-found__btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: linear-gradient(135deg, #405de6, #5851db, #833ab4);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-md);
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(88, 81, 219, 0.3);
  transition: all var(--transition-fast);
}

.not-found__btn:hover {
  box-shadow: 0 4px 16px rgba(88, 81, 219, 0.45);
  transform: translateY(-1px);
}
</style>
