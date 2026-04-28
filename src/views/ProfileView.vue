<template>
  <div class="profile-view">
    <div class="profile-view__container">

      <div v-if="loading" class="profile-view__loader">
        <div class="spinner"></div>
      </div>

      <div v-else-if="profileErro" class="profile-view__error">
        <p>{{ profileErro }}</p>
        <RouterLink to="/feed" class="profile-view__back">Voltar ao feed</RouterLink>
      </div>

      <template v-else-if="profileUser">
        <ProfileHeader
          :user="profileUser"
          :posts-count="posts.length"
          :seguidores-count="seguidoresCount"
          :seguindo-count="seguindoCount"
          :is-own="isOwn"
          :is-seguindo="estaSeguindo"
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
import api from '@/services/api.js'
import { useAuthStore } from '@/stores/auth.js'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import PostGrid from '@/components/profile/PostGrid.vue'

const route = useRoute()
const auth = useAuthStore()

const profileUser = ref(null)
const posts = ref([])
const seguidoresCount = ref(0)
const seguindoCount = ref(0)
const estaSeguindo = ref(false)
const loading = ref(false)
const postsLoading = ref(false)
const profileErro = ref('')

const targetUsername = computed(() => route.query.user || auth.user?.username)
const isOwn = computed(() => {
  if (!auth.user || !profileUser.value) return false
  return auth.user.id === profileUser.value.id
})

async function carregarPerfil() {
  if (!targetUsername.value) return
  loading.value = true
  profileErro.value = ''
  try {
    const { data: userData } = await api.get(`/users/${targetUsername.value}`)
    profileUser.value = userData.data ?? userData

    const userId = profileUser.value.id
    const [postsRes, seguidoresRes, seguindoRes] = await Promise.all([
      api.get(`/users/${userId}/posts`),
      api.get(`/users/${userId}/followers`),
      api.get(`/users/${userId}/following`),
    ])

    posts.value = postsRes.data.data ?? postsRes.data ?? []
    seguidoresCount.value = seguidoresRes.data.total ?? (seguidoresRes.data.data ?? seguidoresRes.data ?? []).length
    seguindoCount.value = seguindoRes.data.total ?? (seguindoRes.data.data ?? seguindoRes.data ?? []).length

    if (!isOwn.value) {
      try {
        const { data: followData } = await api.get(`/users/${userId}/is-following`)
        estaSeguindo.value = followData.is_following ?? followData ?? false
      } catch {
        estaSeguindo.value = false
      }
    }
  } catch (err) {
    profileErro.value = err.response?.status === 404 ? 'Perfil não encontrado.' : 'Erro ao carregar perfil.'
  } finally {
    loading.value = false
  }
}

function onFollowToggled(nowFollowing) {
  estaSeguindo.value = nowFollowing
  seguidoresCount.value += nowFollowing ? 1 : -1
}

watch(() => route.query.user, () => { carregarPerfil() })
onMounted(() => { carregarPerfil() })
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