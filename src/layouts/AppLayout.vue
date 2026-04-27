<template>
  <div class="layout">
    <!-- Sidebar (desktop) -->
    <aside class="sidebar">
      <div class="sidebar-inner">
        <RouterLink to="/feed" class="logo">Lumeo</RouterLink>

        <nav class="nav">
          <RouterLink
            v-for="item in paginas"
            :key="item.rota"
            :to="item.rota"
            class="nav-item"
            active-class="nav-item-ativo"
            exact-active-class="nav-item-ativo"
          >
            <span class="nav-icone" v-html="item.icone" />
            <span class="nav-label">{{ item.nome }}</span>
          </RouterLink>
        </nav>

        <button class="sair" @click="sair">
          <span class="nav-icone" v-html="icones.sair" />
          <span class="nav-label">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Conteudo principal -->
    <main class="principal" :class="modoLayout">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>

    <!-- Coluna direita — aparece so no feed (desktop) -->
    <aside class="coluna-direita" v-if="estaNoFeed">
      <div class="usuario-atual" v-if="auth.user">
        <div class="usuario-avatar">
          <img
            :src="auth.user.avatar ?? 'https://i.pravatar.cc/44?img=1'"
            :alt="auth.user.username"
          />
        </div>
        <div>
          <p class="usuario-nome">{{ auth.user.username }}</p>
          <p class="usuario-fullname">{{ auth.user.name }}</p>
        </div>
      </div>

      <p class="sugestoes-titulo">Sugestoes para voce</p>
      <p class="sugestoes-vazio">Carregando sugestoes...</p>
    </aside>

    <!-- Navbar inferior (mobile) -->
    <nav class="nav-mobile">
      <RouterLink
        v-for="item in paginas"
        :key="item.rota"
        :to="item.rota"
        class="nav-mobile-item"
        active-class="nav-mobile-item-ativo"
        exact-active-class="nav-mobile-item-ativo"
      >
        <span v-html="item.icone" />
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { ROUTE_NAMES } from '@/router/routeNames.js'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// Detecta se esta no feed para mostrar a coluna direita
const estaNoFeed = computed(() => route.meta.navItem === 'feed')

// Modo de layout baseado no meta.navItem da rota ativa
const modoLayout = computed(() => {
  const item = route.meta.navItem
  if (item === 'feed')    return 'modo-feed'
  if (item === 'profile') return 'modo-profile'
  return 'modo-default'
})

const icones = {
  feed: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15v-6h-6v6H3.75A.75.75 0 013 21V9.75z"/></svg>`,
  discover: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
  criar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>`,
  perfil: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
  sair: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9"/></svg>`,
}

const paginas = [
  { rota: '/feed',     nome: 'Feed',   icone: icones.feed    },
  { rota: '/discover', nome: 'Buscar', icone: icones.discover },
  { rota: '/create',   nome: 'Criar',  icone: icones.criar   },
  { rota: '/profile',  nome: 'Perfil', icone: icones.perfil  },
]

async function sair() {
  await auth.logout()
  router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.principal {
  flex: 1;
  padding-bottom: var(--nav-height);
}

/* Sidebar — so no desktop */
.sidebar {
  display: none;
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    width: var(--sidebar-width);
    border-right: 1px solid var(--border);
    background: white;
    position: sticky;
    top: 0;
    height: 100vh;
    flex-shrink: 0;
  }

  .principal {
    padding-bottom: 0;
  }
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px 12px;
}

.logo {
  font-size: 28px;
  font-family: 'Billabong', 'Grand Hotel', cursive;
  padding: 12px;
  margin-bottom: 16px;
  display: block;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-item,
.sair {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  color: var(--text);
  transition: background 0.15s ease;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.nav-item:hover,
.sair:hover {
  background: var(--surface-alt);
}

.nav-item-ativo {
  font-weight: 600;
}

.sair {
  margin-top: auto;
  color: var(--text-muted);
}

.nav-icone {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* Coluna direita — sugestoes no feed */
.coluna-direita {
  display: none;
}

@media (min-width: 1024px) {
  .coluna-direita {
    display: block;
    width: 320px;
    padding: 24px 16px;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    align-self: flex-start;
    max-height: 100vh;
    overflow-y: auto;
  }
}

.usuario-atual {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.usuario-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.usuario-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.usuario-nome {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.usuario-fullname {
  font-size: 13px;
  color: var(--text-muted);
}

.sugestoes-titulo {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.sugestoes-vazio {
  font-size: 13px;
  color: var(--text-muted);
}

/* Navbar mobile */
.nav-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: white;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
}

.nav-mobile-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: var(--text-muted);
  transition: color 0.15s ease;
}

.nav-mobile-item-ativo {
  color: var(--text);
}

@media (min-width: 768px) {
  .nav-mobile {
    display: none;
  }
}
</style>
