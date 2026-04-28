<template>
  <div class="create-post">
    <div class="create-post__container">
      <h1 class="create-post__title">Criar publicação</h1>

      <div class="create-post__content">


        <div class="create-post__upload">
          <div v-if="!previewUrl" class="create-post__dropzone" @click="$refs.fileInput.click()">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p class="create-post__dropzone-text">Clique para selecionar uma imagem</p>
            <p class="create-post__dropzone-hint">JPEG, PNG ou WebP • Máximo 5 MB</p>
          </div>

          <div v-else class="create-post__preview">
            <img :src="previewUrl" alt="Preview" class="create-post__preview-img" />
            <button class="create-post__preview-remove" type="button" @click="clearImage">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            class="sr-only"
            @change="onFileChange"
          />
        </div>


        <div class="create-post__caption-wrapper">
          <textarea
            v-model="caption"
            class="create-post__caption"
            placeholder="Escreva uma legenda…"
            maxlength="2200"
            rows="4"
          ></textarea>
          <span
            class="create-post__char-count"
            :class="{ 'create-post__char-count--warn': caption.length > 2000 }"
          >
            {{ caption.length }}/2200
          </span>
        </div>

        <p v-if="error" class="create-post__error">{{ error }}</p>

        <button
          class="create-post__submit"
          :disabled="!canSubmit || loading"
          @click="handleSubmit"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else>Publicar</span>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFeedStore } from '@/stores/feed'
import { useImagePreview } from '@/composable/useImagePreview'

const MAX_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const router = useRouter()
const feedStore = useFeedStore()
const { file, previewUrl, setFile, clear: clearPreview } = useImagePreview()

const caption = ref('')
const error = ref('')
const loading = ref(false)

const canSubmit = computed(() => !!file.value && caption.value.trim().length > 0)

function onFileChange(e) {
  const selected = e.target.files?.[0]
  if (!selected) return
  error.value = ''
  if (!ACCEPTED_TYPES.includes(selected.type)) {
    error.value = 'Formato não suportado. Use JPEG, PNG ou WebP.'
    return
  }
  if (selected.size > MAX_SIZE) {
    error.value = 'A imagem deve ter no máximo 5 MB.'
    return
  }
  setFile(selected)
}

function clearImage() {
  clearPreview()
  error.value = ''
}

async function handleSubmit() {
  if (!canSubmit.value) return
  error.value = ''
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file.value)
    formData.append('caption', caption.value.trim())
    await feedStore.createPost(formData)
    router.push({ name: 'feed' })
  } catch (err) {
    error.value = err.response?.data?.message ?? 'Erro ao publicar. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-post {
  padding: 24px 16px;
}

.create-post__container {
  max-width: 520px;
  margin: 0 auto;
}

.create-post__title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

.create-post__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.create-post__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-muted);
  background: var(--color-surface);
}

.create-post__dropzone:hover {
  border-color: var(--color-accent);
  background: rgba(225,48,108,.02);
}

.create-post__dropzone-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.create-post__dropzone-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

.create-post__preview {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.create-post__preview-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.create-post__preview-remove {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,.65);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  backdrop-filter: blur(4px);
  transition: background var(--transition-fast);
}

.create-post__preview-remove:hover {
  background: rgba(0,0,0,.85);
}

.create-post__caption-wrapper {
  position: relative;
}

.create-post__caption {
  width: 100%;
  padding: 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-surface);
  resize: vertical;
  min-height: 100px;
  outline: none;
  transition: border-color var(--transition-fast);
}

.create-post__caption:focus {
  border-color: var(--color-accent);
}

.create-post__char-count {
  position: absolute;
  bottom: 10px;
  right: 14px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.create-post__char-count--warn {
  color: var(--color-error);
}

.create-post__error {
  font-size: 13px;
  color: var(--color-error);
  padding: 10px 14px;
  background: rgba(237,73,86,.08);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-error);
}

.create-post__submit {
  padding: 14px;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  background-size: 300% auto;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  transition: background-position 0.5s ease, box-shadow 0.2s, transform 0.1s;
  box-shadow: 0 4px 20px rgba(220,39,67,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

.create-post__submit:hover:not(:disabled) {
  background-position: right center;
  box-shadow: 0 8px 30px rgba(220,39,67,.45);
  transform: translateY(-1px);
}

.create-post__submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>