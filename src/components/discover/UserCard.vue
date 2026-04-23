<template>
  <div class="user-card" @click="goToProfile">
    <AppAvatar
      :src="user.avatar_url"
      :name="user.name"
      size="lg"
      :show-gradient="true"
    />
    <div class="user-card__info">
      <span class="user-card__name">{{ user.name }}</span>
      <span class="user-card__username">@{{ user.username }}</span>
    </div>
    <FollowButton
      v-if="!isSelf"
      :user-id="user.id"
      :is-following="isFollowing"
      @toggled="(v) => $emit('follow-toggled', user.id, v)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppAvatar from '@/components/shared/AppAvatar.vue'
import FollowButton from '@/components/shared/FollowButton.vue'

const props = defineProps({
  user: { type: Object, required: true },
  isFollowing: { type: Boolean, default: false },
})

defineEmits(['follow-toggled'])

const router = useRouter()
const auth = useAuthStore()

const isSelf = computed(() => auth.user?.id === props.user.id)

function goToProfile() {
  if (isSelf.value) {
    router.push('/perfil')
  } else {
    router.push(`/perfil?user=${props.user.username}`)
  }
}
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-card:hover {
  border-color: rgba(225, 48, 108, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.user-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-card__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-card__username {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
