<template>
  <header class="profile-header">
    <div class="profile-header__top">
      <AppAvatar
        :src="user.avatar_url"
        :name="user.name"
        size="xl"
        :show-gradient="true"
      />

      <div class="profile-header__stats">
        <div class="profile-header__stat">
          <span class="profile-header__stat-number">{{ postsCount }}</span>
          <span class="profile-header__stat-label">publicações</span>
        </div>

        <RouterLink :to="followersLink" class="profile-header__stat profile-header__stat--link">
          <span class="profile-header__stat-number">{{ followersCount }}</span>
          <span class="profile-header__stat-label">seguidores</span>
        </RouterLink>

        <RouterLink :to="followingLink" class="profile-header__stat profile-header__stat--link">
          <span class="profile-header__stat-number">{{ followingCount }}</span>
          <span class="profile-header__stat-label">seguindo</span>
        </RouterLink>
      </div>
    </div>

    <div class="profile-header__info">
      <h1 class="profile-header__name">{{ user.name }}</h1>
      <p class="profile-header__username">@{{ user.username }}</p>
      <p v-if="user.bio" class="profile-header__bio">{{ user.bio }}</p>
    </div>

    <div class="profile-header__actions">
      <RouterLink
        v-if="isOwn"
        to="/perfil/editar"
        class="profile-header__edit-btn"
      >
        Editar perfil
      </RouterLink>

      <FollowButton
        v-else
        :user-id="user.id"
        :is-following="isFollowing"
        @toggled="(v) => $emit('follow-toggled', v)"
      />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import AppAvatar from '@/components/shared/AppAvatar.vue'
import FollowButton from '@/components/shared/FollowButton.vue'

const props = defineProps({
  user: { type: Object, required: true },
  postsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  isOwn: { type: Boolean, default: false },
  isFollowing: { type: Boolean, default: false },
})

defineEmits(['follow-toggled'])

const queryParam = computed(() =>
  props.isOwn ? '' : `?user=${props.user.username}`
)

const followersLink = computed(() =>
  `/perfil/lista/seguidores${queryParam.value}`
)

const followingLink = computed(() =>
  `/perfil/lista/seguindo${queryParam.value}`
)
</script>

<style scoped>
.profile-header {
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 20px;
}

.profile-header__top {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 16px;
}

.profile-header__stats {
  display: flex;
  gap: 28px;
}

.profile-header__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.profile-header__stat--link {
  text-decoration: none;
  color: inherit;
  transition: opacity var(--transition-fast);
}

.profile-header__stat--link:hover {
  opacity: 0.7;
}

.profile-header__stat-number {
  font-size: 17px;
  font-weight: 700;
}

.profile-header__stat-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.profile-header__info {
  margin-bottom: 14px;
}

.profile-header__name {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 0;
  line-height: 1.4;
}

.profile-header__username {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.profile-header__bio {
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.5;
  white-space: pre-wrap;
}

.profile-header__actions {
  display: flex;
  gap: 8px;
}

.profile-header__edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 20px;
  font-size: 13px;
  font-weight: 600;
  border-radius: var(--radius-md);
  background: var(--color-surface-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  text-decoration: none;
  transition: background var(--transition-fast);
}

.profile-header__edit-btn:hover {
  background: var(--color-border);
}

@media (max-width: 480px) {
  .profile-header__top {
    gap: 20px;
  }

  .profile-header__stats {
    gap: 18px;
  }
}
</style>
