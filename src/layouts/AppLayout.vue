<template>
  <div class="app-layout">
    <!-- ── Sidebar (desktop) ───────────────────────────────────────────── -->
    <aside class="sidebar">
      <div class="sidebar__inner">
        <RouterLink to="/feed" class="sidebar__logo">InstaClone</RouterLink>

        <nav class="sidebar__nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="sidebar__nav-item"
            active-class="sidebar__nav-item--active"
          >
            <span class="sidebar__nav-icon" v-html="item.icon" />
            <span class="sidebar__nav-label">{{ item.label }}</span>
            <span v-if="item.badge && unreadCount > 0" class="sidebar__badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
          </RouterLink>
        </nav>

        <button class="sidebar__logout" @click="handleLogout">
          <span class="sidebar__nav-icon" v-html="icons.logout" />
          <span class="sidebar__nav-label">Sair</span>
        </button>
      </div>
    </aside>

    <!-- ── Conteúdo principal ──────────────────────────────────────────── -->
    <main class="app-layout__main">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>

    <!-- ── Navbar inferior (mobile) ───────────────────────────────────── -->
    <nav class="bottom-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="bottom-nav__item"
        active-class="bottom-nav__item--active"
      >
        <span class="bottom-nav__icon-wrap">
          <span v-html="item.icon" />
          <span v-if="item.badge && unreadCount > 0" class="bottom-nav__badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
        </span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()

const unreadCount = ref(0)
let pollInterval = null

async function fetchUnreadCount() {
  try {
    const { data } = await api.get('/notifications/unread-count')
    unreadCount.value = data.unread_count ?? data.count ?? data ?? 0
  } catch {
    // silenciado
  }
}

onMounted(() => {
  fetchUnreadCount()
  pollInterval = setInterval(fetchUnreadCount, 30000) // 30s
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

const icons = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15v-6h-6v6H3.75A.75.75 0 013 21V9.75z"/></svg>`,
  discover: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
  create: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>`,
  notifications: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
  profile: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9"/></svg>`,
}

const navItems = [
  { to: '/feed',           label: 'Home',          icon: icons.home          },
  { to: '/descobrir',      label: 'Buscar',        icon: icons.discover      },
  { to: '/criar',          label: 'Criar',         icon: icons.create        },
  { to: '/notificacoes',   label: 'Notificações',  icon: icons.notifications, badge: true },
  { to: '/perfil',         label: 'Perfil',        icon: icons.profile       },
]

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
/* ── Layout geral ──────────────────────────────────────────────────────── */
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-layout__main {
  flex: 1;
  padding-bottom: var(--navbar-height-mobile); /* espaço para a bottom nav */
}

/* ── Sidebar (desktop) ─────────────────────────────────────────────────── */
.sidebar {
  display: none;
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    width: var(--sidebar-width-desktop);
    border-right: 1px solid var(--color-border);
    background: var(--color-surface);
    position: sticky;
    top: 0;
    height: 100vh;
    flex-shrink: 0;
  }

  .app-layout__main {
    padding-bottom: 0;
  }
}

.sidebar__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-4) var(--space-3);
}

.sidebar__logo {
  font-size: var(--font-size-xl);
  font-family: 'Billabong', 'Grand Hotel', cursive;
  padding: var(--space-3) var(--space-3);
  margin-bottom: var(--space-4);
  letter-spacing: 1px;
  display: block;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}

.sidebar__nav-item,
.sidebar__logout {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--color-text);
  transition: background var(--transition-fast);
  width: 100%;
  text-align: left;
}

.sidebar__nav-item:hover,
.sidebar__logout:hover {
  background: var(--color-surface-alt);
}

.sidebar__nav-item--active {
  font-weight: 600;
}

.sidebar__badge {
  margin-left: auto;
  background: var(--color-error);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.sidebar__logout {
  margin-top: auto;
  color: var(--color-text-muted);
}

/* ── Bottom nav (mobile) ───────────────────────────────────────────────── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height-mobile);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
}

.bottom-nav__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3);
  color: var(--color-text);
  transition: opacity var(--transition-fast);
}

.bottom-nav__icon-wrap {
  position: relative;
  display: inline-flex;
}

.bottom-nav__badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: var(--color-error);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.bottom-nav__item--active {
  color: var(--color-text);
  opacity: 1;
}

.bottom-nav__item:not(.bottom-nav__item--active) {
  opacity: 0.5;
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
</style>