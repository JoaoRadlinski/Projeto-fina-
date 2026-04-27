<template>
  <div class="post-detail">
    <div class="post-detail__container">
      <div v-if="loading" class="post-detail__loader">
        <div class="spinner"></div>
      </div>

      <div v-else-if="error" class="post-detail__error">
        <p>{{ error }}</p>
        <RouterLink to="/feed" class="post-detail__back-link">Voltar ao feed</RouterLink>
      </div>

      <template v-else-if="post">
        <article class="post-detail__card">
          <!-- Header -->
          <header class="post-detail__header">
            <RouterLink :to="authorLink" class="post-detail__author">
              <AppAvatar :src="post.user?.avatar_url" :name="post.user?.name" size="md" />
              <div class="post-detail__author-info">
                <span class="post-detail__author-name">{{ post.user?.name }}</span>
                <span class="post-detail__author-username">@{{ post.user?.username }}</span>
              </div>
            </RouterLink>
            <button
              v-if="isAuthor"
              class="post-detail__delete-btn"
              @click="confirmDeletePost"
              :disabled="deleting"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </header>

          <!-- Imagem -->
          <div class="post-detail__image-wrapper">
            <img :src="post.image_url" :alt="post.caption || 'Post'" class="post-detail__image" />
          </div>

          <!-- Ações + info -->
          <div class="post-detail__body">
            <div class="post-detail__actions">
              <button
                class="post-detail__action-btn"
                :class="{ 'post-detail__action-btn--liked': post.is_liked }"
                @click="handleLike"
              >
                <svg width="22" height="22" viewBox="0 0 24 24"
                  :fill="post.is_liked ? '#ed4956' : 'none'"
                  :stroke="post.is_liked ? '#ed4956' : 'currentColor'"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            <p class="post-detail__likes">
              {{ post.likes_count ?? 0 }} curtida{{ (post.likes_count ?? 0) !== 1 ? 's' : '' }}
            </p>

            <p v-if="post.caption" class="post-detail__caption">
              <RouterLink :to="authorLink" class="post-detail__caption-author">{{ post.user?.username }}</RouterLink>
              {{ post.caption }}
            </p>

            <span class="post-detail__time">{{ relativeTime }}</span>
          </div>
        </article>

        <!-- Comentários -->
        <section class="post-detail__comments">
          <h2 class="post-detail__comments-title">
            Comentários ({{ post.comments_count ?? 0 }})
          </h2>

          <div v-if="comments.length === 0 && !commentsLoading" class="post-detail__no-comments">
            Nenhum comentário ainda. Seja o primeiro!
          </div>

          <div v-for="comment in comments" :key="comment.id" class="post-detail__comment">
            <AppAvatar :src="comment.user?.avatar_url" :name="comment.user?.name" size="sm" />
            <div class="post-detail__comment-body">
              <p class="post-detail__comment-text">
                <RouterLink :to="getProfileLink(comment.user)" class="post-detail__comment-author">
                  {{ comment.user?.username }}
                </RouterLink>
                {{ comment.body }}
              </p>
              <div class="post-detail__comment-meta">
                <span class="post-detail__comment-time">{{ formatTime(comment.created_at) }}</span>
                <button
                  v-if="isCommentAuthor(comment)"
                  class="post-detail__comment-delete"
                  @click="deleteComment(comment.id)"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>

          <button
            v-if="commentsHasMore"
            class="post-detail__load-more"
            :disabled="commentsLoading"
            @click="loadMoreComments"
          >
            <span v-if="commentsLoading" class="spinner spinner--sm"></span>
            <span v-else>Carregar mais</span>
          </button>

          <div class="post-detail__add-comment">
            <CommentInput @submitted="handleAddComment" />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useRelativeTime } from '@/composable/useRelativeTime'
import AppAvatar from '@/components/shared/AppAvatar.vue'
import CommentInput from '@/components/feed/CommentInput.vue'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const post             = ref(null)
const comments         = ref([])
const loading          = ref(false)
const error            = ref('')
const deleting         = ref(false)
const commentsLoading  = ref(false)
const commentsPage     = ref(1)
const commentsLastPage = ref(1)

const isAuthor      = computed(() => auth.user?.id === post.value?.user?.id)
const commentsHasMore = computed(() => commentsPage.value < commentsLastPage.value)
const relativeTime  = computed(() => useRelativeTime(post.value?.created_at))
const authorLink    = computed(() => {
  const u = post.value?.user?.username
  return u ? `/perfil?user=${u}` : '/perfil'
})

function formatTime(d)         { return useRelativeTime(d) }
function isCommentAuthor(c)    { return auth.user?.id === c.user?.id }
function getProfileLink(user)  {
  if (!user) return '/perfil'
  return auth.user?.id === user.id ? '/perfil' : `/perfil?user=${user.username}`
}

async function loadPost() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await api.get(`/posts/${route.params.postId}`)
    post.value = data.data ?? data
  } catch (err) {
    error.value = err.response?.status === 404 ? 'Post não encontrado.' : 'Erro ao carregar post.'
  } finally {
    loading.value = false
  }
}

async function loadComments(page = 1) {
  commentsLoading.value = true
  try {
    const { data } = await api.get(`/posts/${route.params.postId}/comments`, { params: { page } })
    if (page === 1) {
      comments.value = data.data ?? data ?? []
    } else {
      comments.value.push(...(data.data ?? data ?? []))
    }
    commentsPage.value     = data.current_page ?? page
    commentsLastPage.value = data.last_page ?? 1
  } catch { /* silenciado */ }
  finally { commentsLoading.value = false }
}

function loadMoreComments() { loadComments(commentsPage.value + 1) }

async function handleLike() {
  if (!post.value) return
  const wasLiked = post.value.is_liked
  post.value.is_liked    = !wasLiked
  post.value.likes_count += wasLiked ? -1 : 1
  try {
    if (wasLiked) { await api.delete(`/posts/${post.value.id}/unlike`) }
    else          { await api.post(`/posts/${post.value.id}/like`) }
  } catch {
    post.value.is_liked    = wasLiked
    post.value.likes_count += wasLiked ? 1 : -1
  }
}

async function handleAddComment(body) {
  try {
    const { data } = await api.post(`/posts/${route.params.postId}/comments`, { body })
    comments.value.push(data.data ?? data)
    if (post.value) post.value.comments_count = (post.value.comments_count ?? 0) + 1
  } catch { /* silenciado */ }
}

async function deleteComment(commentId) {
  if (!confirm('Excluir este comentário?')) return
  try {
    await api.delete(`/comments/${commentId}`)
    comments.value = comments.value.filter((c) => c.id !== commentId)
    if (post.value) post.value.comments_count = Math.max(0, (post.value.comments_count ?? 1) - 1)
  } catch { /* silenciado */ }
}

async function confirmDeletePost() {
  if (!confirm('Tem certeza que deseja excluir este post?')) return
  deleting.value = true
  try {
    await api.delete(`/posts/${post.value.id}`)
    router.push({ name: 'feed' })
  } catch { deleting.value = false }
}

onMounted(async () => {
  await loadPost()
  if (post.value) await loadComments()
})
</script>

<style scoped>
.post-detail { padding: 20px 16px; }
.post-detail__container { max-width: 600px; margin: 0 auto; }
.post-detail__loader { display: flex; justify-content: center; padding: 80px 0; }
.spinner { width: 32px; height: 32px; border: 3px solid var(--color-border); border-top-color: var(--color-accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
.spinner--sm { width: 18px; height: 18px; border-width: 2px; }
@keyframes spin { to { transform: rotate(360deg); } }
.post-detail__error { text-align: center; padding: 80px 24px; color: var(--color-text-muted); }
.post-detail__back-link { display: inline-block; margin-top: 12px; color: var(--color-accent); font-weight: 600; text-decoration: none; }

.post-detail__card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
.post-detail__header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; }
.post-detail__author { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; }
.post-detail__author-info { display: flex; flex-direction: column; }
.post-detail__author-name { font-size: 14px; font-weight: 600; }
.post-detail__author-username { font-size: 12px; color: var(--color-text-muted); }
.post-detail__delete-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; color: var(--color-text-muted); background: none; border: none; cursor: pointer; transition: all var(--transition-fast); }
.post-detail__delete-btn:hover { color: var(--color-error); background: rgba(237,73,86,0.08); }
.post-detail__image-wrapper { width: 100%; background: var(--color-surface-alt); }
.post-detail__image { width: 100%; display: block; object-fit: cover; }
.post-detail__body { padding: 14px 16px; }
.post-detail__actions { display: flex; gap: 12px; margin-bottom: 8px; }
.post-detail__action-btn { display: flex; align-items: center; color: var(--color-text); background: none; border: none; cursor: pointer; padding: 2px; transition: transform var(--transition-fast); }
.post-detail__action-btn:hover { transform: scale(1.1); }
.post-detail__action-btn--liked { animation: like-pop 0.35s ease; }
@keyframes like-pop { 0% { transform: scale(1); } 25% { transform: scale(1.3); } 50% { transform: scale(0.95); } 100% { transform: scale(1); } }
.post-detail__likes { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
.post-detail__caption { font-size: 14px; line-height: 1.5; margin-bottom: 6px; word-break: break-word; }
.post-detail__caption-author { font-weight: 600; text-decoration: none; color: var(--color-text); margin-right: 4px; }
.post-detail__caption-author:hover { text-decoration: underline; }
.post-detail__time { font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; }

.post-detail__comments { margin-top: 20px; }
.post-detail__comments-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
.post-detail__no-comments { font-size: 14px; color: var(--color-text-muted); text-align: center; padding: 24px 0; }
.post-detail__comment { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--color-border); }
.post-detail__comment:last-of-type { border-bottom: none; }
.post-detail__comment-body { flex: 1; min-width: 0; }
.post-detail__comment-text { font-size: 13px; line-height: 1.5; word-break: break-word; }
.post-detail__comment-author { font-weight: 600; text-decoration: none; color: var(--color-text); margin-right: 4px; }
.post-detail__comment-author:hover { text-decoration: underline; }
.post-detail__comment-meta { display: flex; gap: 12px; margin-top: 4px; }
.post-detail__comment-time { font-size: 11px; color: var(--color-text-muted); }
.post-detail__comment-delete { font-size: 11px; color: var(--color-error); background: none; border: none; cursor: pointer; padding: 0; font-weight: 500; }
.post-detail__comment-delete:hover { text-decoration: underline; }
.post-detail__load-more { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 10px; margin: 12px 0; font-size: 13px; font-weight: 600; color: var(--color-accent); background: none; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-fast); }
.post-detail__load-more:hover:not(:disabled) { border-color: var(--color-accent); }
.post-detail__load-more:disabled { opacity: 0.5; cursor: not-allowed; }
.post-detail__add-comment { margin-top: 16px; padding-top: 8px; }
</style>
