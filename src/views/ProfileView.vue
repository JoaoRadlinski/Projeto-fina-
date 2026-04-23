<template>
  <div class="profile-view">
    <div class="profile-view__container">
      <!-- Loading -->
      <div v-if="loading" class="profile-view__loader">
        <div class="spinner"></div>
      </div>

      <!-- Erro -->
      <div v-else-if="profileError" class="profile-view__error">
        <p>{{ profileError }}</p>
        <RouterLink to="/feed" class="profile-view__back">Voltar ao feed</RouterLink>
      </div>

      <!-- Conteúdo -->
      <template v-else-if="profileUser">
        <ProfileHeader
          :user="profileUser"
          :posts-count="posts.length"
          :followers-count="followersCount"
          :following-count="followingCount"
          :is-own="isOwn"
          :is-following="isFollowing"
          @follow-toggled="onFollowToggled"
        />

        <PostGrid :posts="posts" :loading="postsLoading" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import PostGrid from '@/components/profile/PostGrid.vue'

const route = useRoute()
const auth = useAuthStore()

const profileUser = ref(null)
const posts = ref([])
const followersCount = ref(0)
const followingCount = ref(0)
const isFollowing = ref(false)
const loading = ref(false)
const postsLoading = ref(false)
const profileError = ref('')

const targetUsername = computed(() => route.query.user || auth.user?.username)
const isOwn = computed(() => {
  if (!auth.user || !profileUser.value) return false
  return auth.user.id === profileUser.value.id
})

async function loadProfile() {
  if (!targetUsername.value) return

  loading.value = true
  profileError.value = ''

  try {
    // 1. Buscar perfil
    const { data: userData } = await api.get(`/users/${targetUsername.value}`)
    profileUser.value = userData.data ?? userData

    const userId = profileUser.value.id

    // 2. Carregar posts, seguidores e seguindo em paralelo
    const [postsRes, followersRes, followingRes] = await Promise.all([
      api.get(`/users/${userId}/posts`),
      api.get(`/users/${userId}/followers`),
      api.get(`/users/${userId}/following`),
    ])

    posts.value = postsRes.data.data ?? postsRes.data ?? []
    followersCount.value = followersRes.data.total ?? (followersRes.data.data ?? followersRes.data ?? []).length
    followingCount.value = followingRes.data.total ?? (followingRes.data.data ?? followingRes.data ?? []).length

    // 3. Para perfis de terceiros, verificar se segue
    if (!isOwn.value) {
      try {
        const { data: followData } = await api.get(`/users/${userId}/is-following`)
        isFollowing.value = followData.is_following ?? followData ?? false
      } catch {
        isFollowing.value = false
      }
    }
  } catch (err) {
    profileError.value = err.response?.status === 404
      ? 'Perfil não encontrado.'
      : 'Erro ao carregar perfil.'
  } finally {
    loading.value = false
  }
}

function onFollowToggled(nowFollowing) {
  isFollowing.value = nowFollowing
  followersCount.value += nowFollowing ? 1 : -1
}

// Observar mudanças na query (e.g. navegação entre perfis)
watch(() => route.query.user, () => {
  loadProfile()
})

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-view {
  padding: 20px 16px;
}

.profile-view__container {
  max-width: 600px;
  margin: 0 auto;
}

.profile-view__loader {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-view__error {
  text-align: center;
  padding: 80px 24px;
  color: var(--color-text-muted);
}

.profile-view__back {
  display: inline-block;
  margin-top: 12px;
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
}

.profile-view__back:hover {
  text-decoration: underline;
}
</style>
