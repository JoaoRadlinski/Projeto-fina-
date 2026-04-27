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
  width: 100%;
  min-height: 100vh;
}

.auth-layout__main {
  width: 100%;
  min-height: 100vh;
}
</style>
