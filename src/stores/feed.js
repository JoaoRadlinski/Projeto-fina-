import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

// Normaliza a lista de posts independente do formato da API
function normalizeList(data) {
  return data?.data ?? data?.items ?? (Array.isArray(data) ? data : [])
}

export const useFeedStore = defineStore('feed', () => {
  const posts      = ref({})      // dicionário id → post
  const orderedIds = ref([])      // ids na ordem do feed
  const nextCursor = ref(null)    // cursor para próxima página
  const loading    = ref(false)
  const error      = ref('')

  const orderedPosts = computed(() =>
    orderedIds.value.map((id) => posts.value[id]).filter(Boolean)
  )
  const hasMore = computed(() => nextCursor.value !== null)

  function upsertPosts(items) {
    for (const item of items) {
      const post = item?.data ?? item           // normaliza Resource wrapper
      if (!post?.id) continue
      posts.value[post.id] = post
      if (!orderedIds.value.includes(post.id)) {
        orderedIds.value.push(post.id)
      }
    }
  }

  function prependPost(raw) {
    const post = raw?.data ?? raw
    if (!post?.id) return
    posts.value[post.id] = post
    orderedIds.value.unshift(post.id)
  }

  async function fetchFeed() {
    loading.value = true
    error.value   = ''
    try {
      const { data } = await api.get('/feed')
      posts.value      = {}
      orderedIds.value = []
      upsertPosts(normalizeList(data))
      nextCursor.value = data.next_cursor ?? data.meta?.next_cursor ?? null
    } catch (err) {
      error.value = err.response?.data?.message ?? 'Erro ao carregar o feed.'
    } finally {
      loading.value = false
    }
  }

  async function loadMoreFeed() {
    if (!nextCursor.value || loading.value) return
    loading.value = true
    try {
      const { data } = await api.get('/feed', { params: { cursor: nextCursor.value } })
      upsertPosts(normalizeList(data))
      nextCursor.value = data.next_cursor ?? data.meta?.next_cursor ?? null
    } catch {
      // silenciado — feed continua mostrando o que já tem
    } finally {
      loading.value = false
    }
  }

  async function toggleLike(postId) {
    const post = posts.value[postId]
    if (!post) return
    const wasLiked   = post.is_liked
    // Atualização otimista
    post.is_liked    = !wasLiked
    post.likes_count = (post.likes_count ?? 0) + (wasLiked ? -1 : 1)
    try {
      if (wasLiked) {
        await api.delete(`/posts/${postId}/unlike`)
      } else {
        const { data } = await api.post(`/posts/${postId}/like`)
        // Atualiza contagem com o valor real da API se disponível
        if (data?.likes_count != null) post.likes_count = data.likes_count
      }
    } catch {
      // Reverte em caso de erro
      post.is_liked    = wasLiked
      post.likes_count = (post.likes_count ?? 0) + (wasLiked ? 1 : -1)
    }
  }

  async function addComment(postId, body) {
    const { data } = await api.post(`/posts/${postId}/comments`, { body })
    const post = posts.value[postId]
    if (post) {
      post.comments_count = (post.comments_count ?? 0) + 1
    }
    return data?.data ?? data
  }

  async function createPost(formData) {
    const { data } = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const post = data?.data ?? data
    if (post?.id) prependPost(post)
    return post
  }

  async function deletePost(postId) {
    await api.delete(`/posts/${postId}`)
    delete posts.value[postId]
    orderedIds.value = orderedIds.value.filter((id) => id !== postId)
  }

  return {
    posts,
    orderedIds,
    nextCursor,
    loading,
    error,
    orderedPosts,
    hasMore,
    fetchFeed,
    loadMoreFeed,
    toggleLike,
    addComment,
    createPost,
    deletePost,
  }
})
