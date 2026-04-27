import { createRouter, createWebHistory } from 'vue-router'
import { TOKEN_KEY } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ── Redireciona raiz para /feed ───────────────────────────────────────
  {
    path: '/',
    redirect: '/feed',
  },

  // ── Rotas de visitante (AuthLayout) ───────────────────────────────────
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
      },
      {
        path: 'cadastro',
        name: 'cadastro',
        component: () => import('@/views/auth/RegisterView.vue'),
      },
    ],
  },

  // ── Rotas autenticadas (AppLayout) ────────────────────────────────────
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'feed',
        name: 'feed',
        component: () => import('@/views/FeedView.vue'),
      },
      {
        path: 'descobrir',
        name: 'descobrir',
        component: () => import('@/views/DiscoverView.vue'),
      },
      {
        path: 'criar',
        name: 'criar',
        component: () => import('@/views/CreatePostView.vue'),
      },
      {
        path: 'perfil',
        name: 'perfil',
        component: () => import('@/views/ProfileView.vue'),
      },
      {
        path: 'perfil/editar',
        name: 'perfil-editar',
        component: () => import('@/views/EditProfileView.vue'),
      },
      {
        path: 'perfil/lista/:type',
        name: 'perfil-lista',
        component: () => import('@/views/ConnectionListView.vue'),
      },
      {
        path: 'posts/:postId',
        name: 'post-detalhe',
        component: () => import('@/views/PostDetailView.vue'),
      },
    ],
  },

  // ── 404 curinga ───────────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ── Guards globais ────────────────────────────────────────────────────────
router.beforeEach(async (to) => {
  const hasToken = !!localStorage.getItem(TOKEN_KEY)

  if (to.meta.requiresAuth && !hasToken) {
    return { name: 'login' }
  }

  if (to.meta.requiresGuest && hasToken) {
    return { name: 'feed' }
  }

  if (hasToken) {
    const auth = useAuthStore()
    if (!auth.user) {
      try {
        await auth.fetchMe()
      } catch {
        return { name: 'login' }
      }
    }
  }
})

export default router
