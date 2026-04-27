<template>
  <div class="pagina">
    <!-- Busca -->
    <div class="busca">
      <div class="campo-busca">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="termo"
          type="text"
          placeholder="Buscar pessoas ou conteudo..."
          @input="buscar"
        />
      </div>
    </div>

    <!-- Grade de fotos -->
    <div class="grade">
      <div
        v-for="foto in fotos"
        :key="foto.id"
        class="foto-item"
        :class="{ 'foto-destaque': foto.destaque }"
      >
        <img :src="foto.url" :alt="foto.alt" />
        <div class="foto-hover">
          <span>{{ foto.curtidas }} curtidas</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const termo = ref('')

const fotos = ref([
  { id: 1,  url: 'https://picsum.photos/seed/d1/300/300',  alt: 'foto 1',  curtidas: 842,  destaque: true  },
  { id: 2,  url: 'https://picsum.photos/seed/d2/300/300',  alt: 'foto 2',  curtidas: 321,  destaque: false },
  { id: 3,  url: 'https://picsum.photos/seed/d3/300/300',  alt: 'foto 3',  curtidas: 654,  destaque: false },
  { id: 4,  url: 'https://picsum.photos/seed/d4/300/300',  alt: 'foto 4',  curtidas: 198,  destaque: false },
  { id: 5,  url: 'https://picsum.photos/seed/d5/300/300',  alt: 'foto 5',  curtidas: 1032, destaque: false },
  { id: 6,  url: 'https://picsum.photos/seed/d6/300/300',  alt: 'foto 6',  curtidas: 477,  destaque: false },
  { id: 7,  url: 'https://picsum.photos/seed/d7/300/300',  alt: 'foto 7',  curtidas: 234,  destaque: false },
  { id: 8,  url: 'https://picsum.photos/seed/d8/300/300',  alt: 'foto 8',  curtidas: 889,  destaque: false },
  { id: 9,  url: 'https://picsum.photos/seed/d9/300/300',  alt: 'foto 9',  curtidas: 567,  destaque: false },
  { id: 10, url: 'https://picsum.photos/seed/d10/300/300', alt: 'foto 10', curtidas: 312,  destaque: false },
  { id: 11, url: 'https://picsum.photos/seed/d11/300/300', alt: 'foto 11', curtidas: 743,  destaque: false },
  { id: 12, url: 'https://picsum.photos/seed/d12/300/300', alt: 'foto 12', curtidas: 128,  destaque: false },
])

function buscar() {
  // integrar com api quando disponivel
}
</script>

<style scoped>
.pagina {
  max-width: 935px;
  margin: 0 auto;
}

/* Campo de busca */
.busca {
  padding: 16px;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
  border-bottom: 1px solid var(--border);
}

.campo-busca {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--surface-alt);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  transition: border-color 0.15s ease;
}

.campo-busca:focus-within {
  border-color: var(--blue);
  background: white;
}

.campo-busca svg {
  color: var(--text-muted);
  flex-shrink: 0;
}

.campo-busca input {
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  color: var(--text);
  width: 100%;
}

.campo-busca input::placeholder {
  color: var(--text-muted);
}

/* Grade de fotos */
.grade {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  padding: 3px;
}

.foto-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
}

.foto-destaque {
  grid-column: span 2;
  grid-row: span 2;
}

.foto-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.foto-item:hover img {
  transform: scale(1.04);
}

.foto-hover {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.foto-item:hover .foto-hover {
  opacity: 1;
}
</style>
