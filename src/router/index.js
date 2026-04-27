import { createRouter, createWebHistory } from 'vue-router'
import { TOKEN_KEY } from '@/services/api.js'
import { useAuthStore } from '@/stores/auth.js'
import { ROUTE_NAMES } from './routeNames.js'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },

  // Rotas publicas (AuthLayout)
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        name: ROUTE_NAMES.LOGIN,
        component: () => import('@/views/auth/LoginView.vue'),
      },
      {
        path: 'register',
        name: ROUTE_NAMES.REGISTER,
        component: () => import('@/views/auth/RegisterView.vue'),
      },
    ],
  },

  // Rotas autenticadas (AppLayout)
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'feed',
        name: ROUTE_NAMES.FEED,
        meta: { navItem: 'feed' },
        component: () => import('@/views/FeedView.vue'),
      },
      {
        path: 'discover',
        name: ROUTE_NAMES.DISCOVER,
        meta: { navItem: 'discover' },
        component: () => import('@/views/DiscoverView.vue'),
      },
      {
        path: 'create',
        name: ROUTE_NAMES.CREATE_POST,
        meta: { navItem: 'create' },
        component: () => import('@/views/CreatePostView.vue'),
      },
      {
        path: 'profile',
        name: ROUTE_NAMES.PROFILE,
        meta: { navItem: 'profile' },
        component: () => import('@/views/ProfileView.vue'),
      },
      {
        path: 'profile/edit',
        name: ROUTE_NAMES.EDIT_PROFILE,
        meta: { navItem: 'profile' },
        component: () => import('@/views/EditProfileView.vue'),
      },
      {
        path: 'profile/list/:type',
        name: ROUTE_NAMES.PROFILE_CONNECTIONS,
        meta: { navItem: 'profile' },
        component: () => import('@/views/ConnectionListView.vue'),
      },
      {
        path: 'posts/:postId',
        name: ROUTE_NAMES.POST_DETAILS,
        component: () => import('@/views/PostDetailView.vue'),
      },
    ],
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard global — hidrata sessao e controla acesso
router.beforeEach(async (to) => {
  const hasToken = !!localStorage.getItem(TOKEN_KEY)

  if (to.meta.requiresAuth && !hasToken) {
    return { name: ROUTE_NAMES.LOGIN }
  }

  if (to.meta.requiresGuest && hasToken) {
    return { name: ROUTE_NAMES.FEED }
  }

  if (hasToken) {
    const auth = useAuthStore()
    if (!auth.user) {
      try {
        await auth.fetchMe()
      } catch {
        return { name: ROUTE_NAMES.LOGIN }
      }
    }
  }
})

export default router
