<template>
  <div class="pagina">
    <!-- Stories -->
    <section class="stories">
      <div class="story" v-for="story in stories" :key="story.id">
        <div class="story-avatar">
          <img :src="story.foto" :alt="story.usuario" />
        </div>
        <span class="story-nome">{{ story.usuario }}</span>
      </div>
    </section>

    <!-- Posts -->
    <section class="posts">
      <article class="post" v-for="post in postagens" :key="post.id">
        <!-- Cabecalho do post -->
        <header class="post-cabecalho">
          <div class="post-autor">
            <div class="avatar">
              <img :src="post.avatar" :alt="post.usuario" />
            </div>
            <div>
              <p class="post-usuario">{{ post.usuario }}</p>
              <p class="post-local" v-if="post.local">{{ post.local }}</p>
            </div>
          </div>
          <button class="post-opcoes" aria-label="Opcoes">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
        </header>

        <!-- Imagem -->
        <div class="post-imagem">
          <img :src="post.imagem" :alt="'Foto de ' + post.usuario" />
        </div>

        <!-- Acoes -->
        <div class="post-acoes">
          <div class="acoes-esquerda">
            <button
              class="acao"
              :class="{ 'acao-curtido': post.curtido }"
              @click="curtir(post)"
              aria-label="Curtir"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
            <button class="acao" aria-label="Comentar">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </button>
          </div>
          <button class="acao" aria-label="Salvar">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>
        </div>

        <!-- Curtidas e legenda -->
        <div class="post-info">
          <p class="post-curtidas">{{ post.curtidas }} curtidas</p>
          <p class="post-legenda">
            <span class="post-usuario-legenda">{{ post.usuario }}</span>
            {{ post.legenda }}
          </p>
          <button class="ver-comentarios" v-if="post.comentarios > 0">
            Ver todos os {{ post.comentarios }} comentarios
          </button>
          <p class="post-tempo">{{ post.tempo }}</p>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stories = ref([
  { id: 1, usuario: 'voce',     foto: 'https://i.pravatar.cc/56?img=1'  },
  { id: 2, usuario: 'ana',      foto: 'https://i.pravatar.cc/56?img=2'  },
  { id: 3, usuario: 'marcos',   foto: 'https://i.pravatar.cc/56?img=3'  },
  { id: 4, usuario: 'julia',    foto: 'https://i.pravatar.cc/56?img=4'  },
  { id: 5, usuario: 'pedro',    foto: 'https://i.pravatar.cc/56?img=5'  },
  { id: 6, usuario: 'carol',    foto: 'https://i.pravatar.cc/56?img=6'  },
])

const postagens = ref([
  {
    id: 1,
    usuario: 'ana_viagens',
    avatar: 'https://i.pravatar.cc/40?img=2',
    local: 'Rio de Janeiro, RJ',
    imagem: 'https://picsum.photos/seed/lumeo1/600/600',
    curtidas: 842,
    curtido: false,
    legenda: 'Cada por do sol e unico. Esse foi especial demais.',
    comentarios: 34,
    tempo: 'Ha 2 horas',
  },
  {
    id: 2,
    usuario: 'marcos_foto',
    avatar: 'https://i.pravatar.cc/40?img=3',
    local: null,
    imagem: 'https://picsum.photos/seed/lumeo2/600/600',
    curtidas: 1203,
    curtido: true,
    legenda: 'Explorando novos angulos. A cidade nunca dorme.',
    comentarios: 58,
    tempo: 'Ha 5 horas',
  },
  {
    id: 3,
    usuario: 'julia.cozinha',
    avatar: 'https://i.pravatar.cc/40?img=4',
    local: 'Sao Paulo, SP',
    imagem: 'https://picsum.photos/seed/lumeo3/600/600',
    curtidas: 376,
    curtido: false,
    legenda: 'Feito com amor e muito carinho para a familia.',
    comentarios: 12,
    tempo: 'Ha 1 dia',
  },
])

function curtir(post) {
  post.curtido = !post.curtido
  post.curtidas += post.curtido ? 1 : -1
}
</script>

<style scoped>
.pagina {
  max-width: 470px;
  margin: 0 auto;
  padding: 16px 0;
}

/* Stories */
.stories {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  overflow-x: auto;
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
  scrollbar-width: none;
}

.stories::-webkit-scrollbar {
  display: none;
}

.story {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.story-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 2px;
  background: var(--grad);
}

.story-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
}

.story-nome {
  font-size: 11px;
  color: var(--text);
  max-width: 60px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
}

/* Post */
.post {
  background: white;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

.post-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.post-autor {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-usuario {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.post-local {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 1px;
}

.post-opcoes {
  color: var(--text-muted);
  padding: 4px;
  display: flex;
  align-items: center;
}

/* Imagem do post */
.post-imagem img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

/* Acoes */
.post-acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 6px;
}

.acoes-esquerda {
  display: flex;
  gap: 14px;
}

.acao {
  display: flex;
  align-items: center;
  color: var(--text);
  padding: 2px;
  transition: transform 0.1s ease, color 0.15s ease;
}

.acao:hover {
  transform: scale(1.1);
}

.acao-curtido {
  color: var(--red);
}

.acao-curtido svg {
  fill: var(--red);
  stroke: var(--red);
}

/* Info do post */
.post-info {
  padding: 0 16px 14px;
}

.post-curtidas {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.post-legenda {
  font-size: 14px;
  color: var(--text);
  line-height: 1.5;
  margin-bottom: 4px;
}

.post-usuario-legenda {
  font-weight: 600;
  margin-right: 4px;
}

.ver-comentarios {
  font-size: 14px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 4px;
}

.post-tempo {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
</style>
