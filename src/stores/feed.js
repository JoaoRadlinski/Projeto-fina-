import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useFeedStore = defineStore('feed', () => {
  // ── Estado ──────────────────────────────────────────────────────────────────
  const posts = ref({})          // dicionário id → post
  const orderedIds = ref([])     // lista de ids na ordem do feed
  const nextCursor = ref(null)   // cursor para paginação
  const loading = ref(false)

  // ── Getters ─────────────────────────────────────────────────────────────────
  const orderedPosts = computed(() =>
    orderedIds.value.map((id) => posts.value[id]).filter(Boolean)
  )

  const hasMore = computed(() => nextCursor.value !== null)

  // ── Helpers internos ────────────────────────────────────────────────────────
  function normalizePosts(items) {
    for (const item of items) {
      posts.value[item.id] = item
      if (!orderedIds.value.includes(item.id)) {
        orderedIds.value.push(item.id)
      }
    }
  }

  // ── Actions ─────────────────────────────────────────────────────────────────
  async function fetchFeed() {
    loading.value = true
    try {
      const { data } = await api.get('/feed')
      // Reset ao buscar do início
      posts.value = {}
      orderedIds.value = []
      normalizePosts(data.items ?? data.data ?? [])
      nextCursor.value = data.next_cursor ?? null
    } finally {
      loading.value = false
    }
  }

  async function loadMoreFeed() {
    if (!nextCursor.value || loading.value) return
    loading.value = true
    try {
      const { data } = await api.get('/feed', {
        params: { cursor: nextCursor.value },
      })
      normalizePosts(data.items ?? data.data ?? [])
      nextCursor.value = data.next_cursor ?? null
    } finally {
      loading.value = false
    }
  }

  async function toggleLike(postId) {
    const post = posts.value[postId]
    if (!post) return

    const wasLiked = post.is_liked
    // Otimista
    post.is_liked = !wasLiked
    post.likes_count += wasLiked ? -1 : 1

    try {
      if (wasLiked) {
        await api.delete(`/posts/${postId}/unlike`)
      } else {
        await api.post(`/posts/${postId}/like`)
      }
    } catch {
      // Reverte
      post.is_liked = wasLiked
      post.likes_count += wasLiked ? 1 : -1
    }
  }

  async function addComment(postId, body) {
    const { data } = await api.post(`/posts/${postId}/comments`, { body })
    const post = posts.value[postId]
    if (post) {
      post.comments_count = (post.comments_count ?? 0) + 1
    }
    return data
  }

  async function createPost(formData) {
    const { data } = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  }

  return {
    posts,
    orderedIds,
    nextCursor,
    loading,
    orderedPosts,
    hasMore,
    fetchFeed,
    loadMoreFeed,
    toggleLike,
    addComment,
    createPost,
  }
})
