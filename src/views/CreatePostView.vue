<template>
  <div class="pagina">
    <div class="card">
      <h2 class="titulo">Nova publicacao</h2>

      <!-- Preview ou area de upload -->
      <div
        class="area-upload"
        :class="{ 'tem-imagem': previewUrl }"
        @dragover.prevent
        @drop.prevent="aoSoltar"
        @click="abrirSeletor"
      >
        <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="preview" />

        <div v-else class="upload-conteudo">
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          <p class="upload-texto">Arraste uma foto aqui</p>
          <p class="upload-sub">ou clique para selecionar (JPG, PNG ou WEBP, max 5 MB)</p>
        </div>

        <input
          ref="inputArquivo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="input-oculto"
          @change="aoSelecionarArquivo"
        />
      </div>

      <p v-if="erroImagem" class="mensagem-erro">{{ erroImagem }}</p>

      <!-- Formulario -->
      <form @submit.prevent="publicar" v-if="previewUrl">
        <div class="campo">
          <label for="legenda">Legenda</label>
          <textarea
            id="legenda"
            v-model="legenda"
            placeholder="Escreva uma legenda..."
            rows="3"
            maxlength="2200"
          />
          <span class="contador">{{ legenda.length }}/2200</span>
        </div>

        <p v-if="erroPublicacao" class="mensagem-erro">{{ erroPublicacao }}</p>

        <div class="acoes">
          <button type="button" class="btn-cancelar" @click="cancelar">
            Cancelar
          </button>
          <button type="submit" class="btn-publicar" :disabled="publicando">
            {{ publicando ? 'Publicando...' : 'Publicar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useImageUpload } from '@/composable/useImageUpload.js'
import { postsService } from '@/services/posts.service.js'
import { ROUTE_NAMES } from '@/router/routeNames.js'

const router = useRouter()

const { arquivo, previewUrl, erro: erroImagem, aoSelecionarArquivo, aoSoltar, limpar } = useImageUpload()

const inputArquivo = ref(null)
const legenda = ref('')
const publicando = ref(false)
const erroPublicacao = ref('')

function abrirSeletor() {
  if (!previewUrl.value) {
    inputArquivo.value?.click()
  }
}

function cancelar() {
  limpar()
  legenda.value = ''
  erroPublicacao.value = ''
}

async function publicar() {
  if (!arquivo.value) return

  publicando.value = true
  erroPublicacao.value = ''

  try {
    const formData = new FormData()
    formData.append('image', arquivo.value)
    formData.append('caption', legenda.value)

    await postsService.create(formData)
    router.push({ name: ROUTE_NAMES.FEED })
  } catch (err) {
    erroPublicacao.value = err?.response?.data?.message ?? 'Nao foi possivel publicar. Tente novamente.'
  } finally {
    publicando.value = false
  }
}
</script>

<style scoped>
.pagina {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 16px;
}

.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.titulo {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

.area-upload {
  position: relative;
  aspect-ratio: 1;
  background: var(--surface-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s ease;
}

.area-upload:not(.tem-imagem):hover {
  background: #ebebeb;
}

.area-upload.tem-imagem {
  cursor: default;
}

.upload-conteudo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  padding: 24px;
  text-align: center;
}

.upload-texto {
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
}

.upload-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.input-oculto {
  display: none;
}

.mensagem-erro {
  font-size: 13px;
  color: var(--red);
  text-align: center;
  padding: 10px 16px;
  background: #fff0f0;
  margin: 0;
}

form {
  padding: 20px;
}

.campo {
  margin-bottom: 16px;
  position: relative;
}

.campo label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 6px;
}

.campo textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--surface-alt);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text);
  outline: none;
  font-family: var(--font);
  resize: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.campo textarea:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(0, 149, 246, 0.12);
  background: white;
}

.contador {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 11px;
  color: var(--text-muted);
}

.acoes {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.btn-cancelar {
  flex: 1;
  padding: 10px;
  background: var(--surface-alt);
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-cancelar:hover {
  background: #e8e8e8;
}

.btn-publicar {
  flex: 2;
  padding: 10px;
  background: var(--blue);
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease;
}

.btn-publicar:hover:not(:disabled) {
  background: var(--blue-dark);
}

.btn-publicar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
