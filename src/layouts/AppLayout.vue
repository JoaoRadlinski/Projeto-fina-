<template>
  <div class="app-layout">

    <!-- ── Sidebar desktop ─────────────────────────────────────────────── -->
    <aside class="sidebar">
      <div class="sidebar__inner">

        <!-- Logo -->
        <RouterLink to="/feed" class="sidebar__logo" aria-label="InstaClone">
          <span class="sidebar__logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </span>
          <span class="sidebar__logo-text">InstaClone</span>
        </RouterLink>

        <!-- Nav principal -->
        <nav class="sidebar__nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="sidebar__item"
            active-class="sidebar__item--active"
          >
            <span class="sidebar__icon" v-html="item.icon" />
            <span class="sidebar__label">{{ item.label }}</span>
          </RouterLink>
        </nav>

        <!-- Alternador de tema escuro -->
        <button class="sidebar__item sidebar__item--theme" @click="toggleTheme" :title="isDark ? 'Modo claro' : 'Modo escuro'">
          <span class="sidebar__icon">
            <!-- Lua (modo escuro ativo → clica pra ir ao claro) -->
            <svg v-if="isDark" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <!-- Sol (modo claro ativo → clica pra ir ao escuro) -->
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1"  x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1"  y1="12" x2="3"  y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </span>
          <span class="sidebar__label">{{ isDark ? 'Modo claro' : 'Modo escuro' }}</span>
        </button>

        <!-- Logout -->
        <button class="sidebar__item sidebar__item--logout" @click="handleLogout">
          <span class="sidebar__icon" v-html="icons.logout" />
          <span class="sidebar__label">Sair</span>
        </button>

      </div>
    </aside>

    <!-- ── Conteúdo principal ──────────────────────────────────────────── -->
    <main class="app-layout__main">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>

    <!-- ── Bottom nav mobile ───────────────────────────────────────────── -->
    <nav class="bottom-nav">
      <RouterLink to="/feed"      class="bottom-nav__item" active-class="bottom-nav__item--active">
        <span v-html="icons.home" />
      </RouterLink>
      <RouterLink to="/descobrir" class="bottom-nav__item" active-class="bottom-nav__item--active">
        <span v-html="icons.discover" />
      </RouterLink>
      <!-- Botão Criar — visualmente destacado -->
      <RouterLink to="/criar"     class="bottom-nav__item bottom-nav__item--create" active-class="bottom-nav__item--active">
        <span v-html="icons.create" />
      </RouterLink>
      <RouterLink to="/perfil"    class="bottom-nav__item" active-class="bottom-nav__item--active">
        <span v-html="icons.profile" />
      </RouterLink>
    </nav>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter }      from 'vue-router'
import { useAuthStore }   from '@/stores/auth.js'

const router = useRouter()
const auth   = useAuthStore()

// ── Tema escuro ─────────────────────────────────────────────────────────
const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.getAttribute('data-theme') === 'dark'
})

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('instaclone.theme', theme)
}

// ── Ícones SVG ──────────────────────────────────────────────────────────
const icons = {
  home:     `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15v-6h-6v6H3.75A.75.75 0 013 21V9.75z"/></svg>`,
  discover: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
  create:   `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>`,
  profile:  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
  logout:   `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9"/></svg>`,
}

const navItems = [
  { to: '/feed',      label: 'Home',      icon: icons.home     },
  { to: '/descobrir', label: 'Descobrir', icon: icons.discover },
  { to: '/criar',     label: 'Criar',     icon: icons.create   },
  { to: '/perfil',    label: 'Perfil',    icon: icons.profile  },
]

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════
   Layout base
═══════════════════════════════════════════════════════ */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}

.app-layout__main {
  flex: 1;
  min-width: 0;
  padding-bottom: var(--navbar-height-mobile);
}

@media (min-width: 768px) {
  .app-layout__main {
    margin-left: 72px;
    padding-bottom: 0;
    transition: margin-left 0.2s ease;
  }
}

/* ═══════════════════════════════════════════════════════
   Sidebar desktop
═══════════════════════════════════════════════════════ */
.sidebar {
  display: none;
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 200;
    width: 72px;
    overflow: hidden;
    background: var(--color-surface);
    border-right: 1px solid var(--color-border);
    transition: width 0.22s ease;
  }

  .sidebar:hover {
    width: 244px;
    box-shadow: 2px 0 16px rgba(0, 0, 0, 0.1);
  }
}

.sidebar__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 244px;
  padding: 12px 0 20px;
}

/* ── Logo ─────────────────────────────────────────── */
.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  margin-bottom: 8px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
}

.sidebar__logo-icon {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar__logo-text {
  font-size: 22px;
  font-family: 'Billabong', 'Grand Hotel', cursive;
  letter-spacing: 1px;
  color: var(--color-text);
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  transition: opacity 0.15s ease 0.04s, max-width 0.2s ease;
}

.sidebar:hover .sidebar__logo-text {
  opacity: 1;
  max-width: 160px;
}

/* ── Itens de navegação ───────────────────────────── */
.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  padding: 0 12px;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  color: var(--color-text);
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  transition: background 0.15s ease;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.sidebar__item:hover {
  background: var(--color-surface-alt);
}

.sidebar__item--active {
  font-weight: 700;
}
.sidebar__item--active .sidebar__icon :deep(svg) {
  stroke-width: 2.3;
}

.sidebar__item--theme {
  margin: 0 12px;
  padding: 12px;
  border-radius: 12px;
  color: var(--color-text-muted);
  font-size: 15px;
  width: auto;
}

.sidebar__item--logout {
  margin: 4px 12px 0;
  padding: 12px;
  border-radius: 12px;
  color: var(--color-text-muted);
  font-size: 15px;
  width: auto;
}

/* Ícone sempre visível */
.sidebar__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Label aparece no hover */
.sidebar__label {
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  transition: opacity 0.15s ease 0.04s, max-width 0.2s ease;
}

.sidebar:hover .sidebar__label {
  opacity: 1;
  max-width: 150px;
}

/* ═══════════════════════════════════════════════════════
   Bottom nav mobile
═══════════════════════════════════════════════════════ */
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
  padding: 10px 14px;
  color: var(--color-text);
  opacity: 0.5;
  transition: opacity 0.15s ease;
  border-radius: 8px;
}

.bottom-nav__item--active {
  opacity: 1;
}

/* Botão Criar — destaque visual estilo Instagram */
.bottom-nav__item--create {
  opacity: 0.7;
  border: 1.5px solid var(--color-border);
  padding: 6px 10px;
  border-radius: 10px;
}

.bottom-nav__item--create.bottom-nav__item--active {
  border-color: var(--color-text);
  opacity: 1;
}

@media (min-width: 768px) {
  .bottom-nav { display: none; }
}
</style>
