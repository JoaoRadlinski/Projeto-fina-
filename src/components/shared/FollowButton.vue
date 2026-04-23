<template>
  <button
    class="follow-btn"
    :class="{
      'follow-btn--following': localFollowing,
      'follow-btn--loading': loading,
    }"
    :disabled="loading"
    @click.stop="toggle"
  >
    <span v-if="loading" class="follow-btn__spinner"></span>
    <template v-else>
      {{ localFollowing ? 'Seguindo' : 'Seguir' }}
    </template>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({
  userId: { type: [Number, String], required: true },
  isFollowing: { type: Boolean, default: false },
})

const emit = defineEmits(['toggled'])

const localFollowing = ref(props.isFollowing)
const loading = ref(false)

watch(() => props.isFollowing, (v) => { localFollowing.value = v })

async function toggle() {
  loading.value = true
  const prev = localFollowing.value
  localFollowing.value = !prev // otimista

  try {
    if (localFollowing.value) {
      await api.post(`/users/${props.userId}/follow`)
    } else {
      await api.delete(`/users/${props.userId}/unfollow`)
    }
    emit('toggled', localFollowing.value)
  } catch {
    localFollowing.value = prev // reverte
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.follow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 20px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 90px;
  min-height: 34px;
  border: none;
}

.follow-btn:not(.follow-btn--following) {
  background: linear-gradient(135deg, #405de6, #5851db, #833ab4);
  color: #fff;
  box-shadow: 0 2px 8px rgba(88, 81, 219, 0.35);
}

.follow-btn:not(.follow-btn--following):hover {
  box-shadow: 0 4px 16px rgba(88, 81, 219, 0.45);
  transform: translateY(-1px);
}

.follow-btn--following {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1.5px solid var(--color-border);
}

.follow-btn--following:hover {
  background: #fef2f2;
  color: var(--color-error);
  border-color: var(--color-error);
}

.follow-btn--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.follow-btn__spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: fb-spin 0.6s linear infinite;
}

@keyframes fb-spin {
  to { transform: rotate(360deg); }
}
</style>
