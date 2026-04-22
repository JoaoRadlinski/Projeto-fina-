<template>
  <div class="auth-layout">
    <main class="auth-layout__main">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--space-4);
}

.auth-layout__main {
  width: 100%;
  max-width: 350px;
}
</style>