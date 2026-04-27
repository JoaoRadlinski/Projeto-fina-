<template>
  <div
    class="app-avatar"
    :class="[`app-avatar--${size}`, { 'app-avatar--gradient': showGradient }]"
  >
    <img
      v-if="src && !imgError"
      :src="src"
      :alt="alt"
      class="app-avatar__img"
      @error="imgError = true"
    />
    <span v-else class="app-avatar__fallback">{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  src:          { type: String,  default: null },
  alt:          { type: String,  default: '' },
  name:         { type: String,  default: '' },
  size:         { type: String,  default: 'md', validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v) },
  showGradient: { type: Boolean, default: false },
})

const imgError = ref(false)

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name.split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('')
})
</script>

<style scoped>
.app-avatar {
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-alt);
  color: var(--color-text-muted);
  font-weight: 600;
  user-select: none;
}
.app-avatar--sm  { width: 32px;  height: 32px;  font-size: 11px; }
.app-avatar--md  { width: 40px;  height: 40px;  font-size: 13px; }
.app-avatar--lg  { width: 56px;  height: 56px;  font-size: 16px; }
.app-avatar--xl  { width: 86px;  height: 86px;  font-size: 22px; }

.app-avatar--gradient {
  padding: 2.5px;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}
.app-avatar--gradient .app-avatar__img,
.app-avatar--gradient .app-avatar__fallback {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
.app-avatar--gradient .app-avatar__fallback {
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}
.app-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.app-avatar__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  letter-spacing: 0.5px;
}
</style>
