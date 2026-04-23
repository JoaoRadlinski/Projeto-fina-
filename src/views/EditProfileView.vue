<template>
  <div class="edit-profile">
    <div class="edit-profile__container">
      <h1 class="edit-profile__title">Editar perfil</h1>

      <!-- Loading -->
      <div v-if="loading" class="edit-profile__loader">
        <div class="spinner"></div>
      </div>

      <form v-else class="edit-profile__form" @submit.prevent="handleSave">
        <!-- Avatar -->
        <div class="edit-profile__avatar-section">
          <AppAvatar
            :src="avatarPreview || user?.avatar_url"
            :name="form.name"
            size="xl"
          />
          <div class="edit-profile__avatar-actions">
            <button type="button" class="edit-profile__avatar-btn" @click="$refs.avatarInput.click()">
              Alterar foto
            </button>
            <p class="edit-profile__avatar-hint">JPEG, PNG ou WebP • Máximo 2 MB</p>
          </div>
          <input
            ref="avatarInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            class="sr-only"
            @change="onAvatarChange"
          />
        </div>

        <!-- Nome -->
        <div class="edit-profile__field">
          <label class="edit-profile__label" for="edit-name">Nome</label>
          <input
            id="edit-name"
            v-model="form.name"
            class="edit-profile__input"
            type="text"
            maxlength="255"
            placeholder="Seu nome"
          />
          <span class="edit-profile__char-count">{{ form.name.length }}/255</span>
          <p v-if="errors.name" class="edit-profile__field-error">{{ errors.name }}</p>
        </div>

        <!-- Username -->
        <div class="edit-profile__field">
          <label class="edit-profile__label" for="edit-username">Nome de usuário</label>
          <input
            id="edit-username"
            v-model="form.username"
            class="edit-profile__input"
            type="text"
            maxlength="30"
            placeholder="nome_de_usuario"
            pattern="^[A-Za-z0-9._]+$"
          />
          <span class="edit-profile__char-count">{{ form.username.length }}/30</span>
          <p v-if="errors.username" class="edit-profile__field-error">{{ errors.username }}</p>
        </div>

        <!-- Bio -->
        <div class="edit-profile__field">
          <label class="edit-profile__label" for="edit-bio">Bio</label>
          <textarea
            id="edit-bio"
            v-model="form.bio"
            class="edit-profile__input edit-profile__textarea"
            maxlength="500"
            placeholder="Conte sobre você…"
            rows="4"
          ></textarea>
          <span class="edit-profile__char-count">{{ form.bio.length }}/500</span>
          <p v-if="errors.bio" class="edit-profile__field-error">{{ errors.bio }}</p>
        </div>

        <!-- Mensagens gerais -->
        <p v-if="generalError" class="edit-profile__error">{{ generalError }}</p>
        <p v-if="success" class="edit-profile__success">Perfil atualizado com sucesso!</p>

        <!-- Botões -->
        <div class="edit-profile__actions">
          <RouterLink to="/perfil" class="edit-profile__cancel-btn">Cancelar</RouterLink>
          <button type="submit" class="edit-profile__save-btn" :disabled="saving">
            <span v-if="saving" class="spinner spinner--sm"></span>
            <span v-else>Salvar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import AppAvatar from '@/components/shared/AppAvatar.vue'

const auth = useAuthStore()
const user = ref(null)
const loading = ref(true)
const saving = ref(false)
const success = ref(false)
const generalError = ref('')
const errors = reactive({ name: '', username: '', bio: '' })

const form = reactive({ name: '', username: '', bio: '' })

// Avatar
const avatarFile = ref(null)
const avatarPreview = ref(null)

function onAvatarChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    generalError.value = 'A foto deve ter no máximo 2 MB.'
    return
  }

  avatarFile.value = file
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = URL.createObjectURL(file)
}

function clearFieldErrors() {
  errors.name = ''
  errors.username = ''
  errors.bio = ''
  generalError.value = ''
  success.value = false
}

async function handleSave() {
  clearFieldErrors()

  // Validação local
  const usernameRegex = /^[A-Za-z0-9._]+$/
  if (!usernameRegex.test(form.username)) {
    errors.username = 'Use apenas letras, números, pontos e underscores.'
    return
  }

  saving.value = true

  try {
    // Salvar avatar se alterado
    if (avatarFile.value) {
      const avatarFD = new FormData()
      avatarFD.append('avatar', avatarFile.value)
      await api.post('/users/me/avatar', avatarFD, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }

    // Salvar dados do perfil
    await api.put('/users/me', {
      name: form.name,
      username: form.username,
      bio: form.bio,
    })

    // Atualizar o user na store de auth
    await auth.fetchMe()
    success.value = true
  } catch (err) {
    const data = err.response?.data
    if (data?.errors) {
      // Erros por campo do Laravel
      if (data.errors.name) errors.name = data.errors.name[0]
      if (data.errors.username) errors.username = data.errors.username[0]
      if (data.errors.bio) errors.bio = data.errors.bio[0]
    } else {
      generalError.value = data?.message ?? 'Erro ao salvar. Tente novamente.'
    }
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    await auth.fetchMe()
    user.value = auth.user
    form.name = user.value?.name ?? ''
    form.username = user.value?.username ?? ''
    form.bio = user.value?.bio ?? ''
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.edit-profile {
  padding: 24px 16px;
}

.edit-profile__container {
  max-width: 480px;
  margin: 0 auto;
}

.edit-profile__title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

.edit-profile__loader {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.spinner--sm {
  width: 18px;
  height: 18px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Avatar section */
.edit-profile__avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding: 20px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.edit-profile__avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-profile__avatar-btn {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-accent);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.edit-profile__avatar-btn:hover {
  text-decoration: underline;
}

.edit-profile__avatar-hint {
  font-size: 11px;
  color: var(--color-text-muted);
}

/* Fields */
.edit-profile__field {
  position: relative;
  margin-bottom: 18px;
}

.edit-profile__label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-text);
}

.edit-profile__input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-surface);
  outline: none;
  transition: border-color var(--transition-fast);
}

.edit-profile__input:focus {
  border-color: var(--color-accent);
}

.edit-profile__textarea {
  resize: vertical;
  min-height: 80px;
}

.edit-profile__char-count {
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-size: 10px;
  color: var(--color-text-muted);
}

.edit-profile__field-error {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 4px;
}

/* Messages */
.edit-profile__error {
  font-size: 13px;
  color: var(--color-error);
  padding: 10px 14px;
  background: rgba(237, 73, 86, 0.08);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-error);
  margin-bottom: 16px;
}

.edit-profile__success {
  font-size: 13px;
  color: var(--color-success);
  padding: 10px 14px;
  background: rgba(46, 204, 113, 0.08);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-success);
  margin-bottom: 16px;
}

/* Actions */
.edit-profile__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.edit-profile__cancel-btn {
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-md);
  background: var(--color-surface-alt);
  color: var(--color-text);
  text-decoration: none;
  transition: background var(--transition-fast);
}

.edit-profile__cancel-btn:hover {
  background: var(--color-border);
}

.edit-profile__save-btn {
  padding: 10px 28px;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #405de6, #5851db, #833ab4);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  min-height: 40px;
  transition: box-shadow 0.2s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(88, 81, 219, 0.3);
}

.edit-profile__save-btn:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(88, 81, 219, 0.45);
  transform: translateY(-1px);
}

.edit-profile__save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
