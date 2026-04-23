<template>
  <div class="connection-list">
    <div
      v-for="user in users"
      :key="user.id"
      class="connection-list__item"
    >
      <RouterLink :to="getProfileLink(user)" class="connection-list__user">
        <AppAvatar :src="user.avatar_url" :name="user.name" size="md" />
        <div class="connection-list__info">
          <span class="connection-list__name">{{ user.name }}</span>
          <span class="connection-list__username">@{{ user.username }}</span>
        </div>
      </RouterLink>

      <FollowButton
        v-if="!isSelf(user)"
        :user-id="user.id"
        :is-following="isFollowing(user.id)"
        @toggled="(v) => $emit('follow-toggled', user.id, v)"
      />
    </div>

    <div v-if="users.length === 0 && !loading" class="connection-list__empty">
      <p>Nenhum usuário encontrado.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import AppAvatar from '@/components/shared/AppAvatar.vue'
import FollowButton from '@/components/shared/FollowButton.vue'

const props = defineProps({
  users: { type: Array, default: () => [] },
  followingIds: { type: Set, default: () => new Set() },
  loading: { type: Boolean, default: false },
})

defineEmits(['follow-toggled'])

const auth = useAuthStore()

function isSelf(user) {
  return auth.user?.id === user.id
}

function isFollowing(userId) {
  return props.followingIds.has(userId)
}

function getProfileLink(user) {
  if (isSelf(user)) return '/perfil'
  return `/perfil?user=${user.username}`
}
</script>

<style scoped>
.connection-list {
  display: flex;
  flex-direction: column;
}

.connection-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.connection-list__item:last-child {
  border-bottom: none;
}

.connection-list__user {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  flex: 1;
  min-width: 0;
}

.connection-list__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.connection-list__name {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.connection-list__username {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.connection-list__empty {
  text-align: center;
  padding: 40px 0;
  color: var(--color-text-muted);
  font-size: 14px;
}
</style>
