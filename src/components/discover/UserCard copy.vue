<template>
  <div class="user-card">
    <RouterLink :to="profileLink" class="user-card__info">
      <AppAvatar :src="user.avatar_url" :name="user.name" size="md" :show-gradient="true" />
      <div class="user-card__text">
        <span class="user-card__name">{{ user.name }}</span>
        <span class="user-card__username">@{{ user.username }}</span>
      </div>
    </RouterLink>
    <FollowButton
      :user-id="user.id"
      :is-following="localFollowing"
      @toggled="onToggled"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppAvatar from '@/components/shared/AppAvatar.vue'
import FollowButton from '@/components/shared/FollowButton.vue'

const props = defineProps({
  user:        { type: Object,  required: true },
  isFollowing: { type: Boolean, default: false },
})

const emit = defineEmits(['follow-toggled'])
const auth = useAuthStore()

const localFollowing = ref(props.isFollowing)

const profileLink = computed(() => {
  if (auth.user?.id === props.user.id) return '/perfil'
  return `/perfil?user=${props.user.username}`
})

function onToggled(val) {
  localFollowing.value = val
  emit('follow-toggled', props.user.id, val)
}
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
}

.user-card__info {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  flex: 1;
  min-width: 0;
}

.user-card__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-card__name {
  font-size: 13px;
  font-weight: 600;
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
