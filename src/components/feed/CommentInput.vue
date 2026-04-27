<template>
  <form class="comment-input" @submit.prevent="submit">
    <input
      v-model="body"
      class="comment-input__field"
      type="text"
      placeholder="Adicione um comentário…"
      :disabled="loading"
      maxlength="500"
    />
    <button class="comment-input__btn" type="submit" :disabled="!body.trim() || loading">
      Publicar
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit    = defineEmits(['submitted'])
const body    = ref('')
const loading = ref(false)

async function submit() {
  if (!body.value.trim()) return
  loading.value = true
  try {
    emit('submitted', body.value.trim())
    body.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.comment-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0 0;
  border-top: 1px solid var(--color-border);
}
.comment-input__field {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  color: var(--color-text);
  background: transparent;
  padding: 4px 0;
}
.comment-input__field::placeholder { color: var(--color-text-muted); }
.comment-input__btn {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-accent);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: opacity var(--transition-fast);
}
.comment-input__btn:disabled { opacity: 0.35; cursor: not-allowed; }
.comment-input__btn:hover:not(:disabled) { opacity: 0.7; }
</style>
