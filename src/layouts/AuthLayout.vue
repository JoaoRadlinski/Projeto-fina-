<template>
  <div class="pagina">
    <!-- Fundo decorativo -->
    <div class="fundo" aria-hidden="true" />

    <main class="conteudo">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 24px 16px;
  position: relative;
  overflow: hidden;
}

/* Círculos decorativos de fundo */
.fundo::before,
.fundo::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0.07;
  pointer-events: none;
}

.fundo::before {
  width: 500px;
  height: 500px;
  background: var(--grad);
  top: -120px;
  right: -100px;
}

.fundo::after {
  width: 350px;
  height: 350px;
  background: var(--grad);
  bottom: -80px;
  left: -80px;
}

.conteudo {
  width: 100%;
  max-width: 380px;
  position: relative;
  z-index: 1;
}
</style>