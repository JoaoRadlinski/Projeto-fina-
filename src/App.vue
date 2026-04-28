<script setup>
import { onMounted } from 'vue'

// Inicializa o tema ao carregar o app.
// Prioridade: localStorage → preferência do sistema → claro
onMounted(() => {
  const saved = localStorage.getItem('instaclone.theme')
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved)
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
})
</script>

<template>
  <RouterView />
</template>
