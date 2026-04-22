<template>
  <div class="auth-form">
    <h1 class="auth-form__logo">InstaClone</h1>

    <p class="auth-form__subtitle">
      Cadastre-se para ver fotos e vídeos dos seus amigos.
    </p>

    <form @submit.prevent="handleRegister">
      <div class="auth-form__field">
        <input
          v-model="form.name"
          type="text"
          placeholder="Nome"
          autocomplete="name"
          :disabled="loading"
          required
        />
      </div>

      <div class="auth-form__field">
        <input
          v-model="form.username"
          type="text"
          placeholder="Nome de usuário"
          autocomplete="username"
          :disabled="loading"
          required
        />
      </div>

      <div class="auth-form__field">
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          autocomplete="email"
          :disabled="loading"
          required
        />
      </div>

      <div class="auth-form__field">
        <input
          v-model="form.password"
          type="password"
          placeholder="Senha"
          autocomplete="new-password"
          :disabled="loading"
          required
        />
      </div>

      <p v-if="error" class="auth-form__error">{{ error }}</p>

      <button type="submit" class="auth-form__btn" :disabled="loading">
        {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
      </button>
    </form>

    <div class="auth-form__footer">
      Tem uma conta?
      <RouterLink to="/login">Entre</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth   = useAuthStore()

const loading = ref(false)
const error   = ref('')
const form    = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})

async function handleRegister() {
  error.value   = ''
  loading.value = true
  try {
    await auth.register(form)
    router.push({ name: 'feed' })
  } catch (err) {
    error.value = err.response?.data?.message ?? 'Erro ao cadastrar. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-form {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.auth-form__logo {
  font-size: var(--font-size-xl);
  font-family: 'Billabong', 'Grand Hotel', cursive;
  text-align: center;
  margin-bottom: var(--space-3);
  letter-spacing: 1px;
}

.auth-form__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: var(--space-4);
}

.auth-form__field {
  margin-bottom: var(--space-3);
}

.auth-form__field input {
  width: 100%;
  padding: 9px var(--space-3);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  outline: none;
  transition: border-color var(--transition-fast);
}

.auth-form__field input:focus {
  border-color: #a8a8a8;
}

.auth-form__error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  text-align: center;
  margin-bottom: var(--space-3);
}

.auth-form__btn {
  width: 100%;
  padding: var(--space-2) 0;
  background: #0095f6;
  color: #fff;
  font-size: var(--font-size-sm);
  font-weight: 600;
  border-radius: var(--radius-sm);
  opacity: 1;
  transition: opacity var(--transition-fast);
}

.auth-form__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-form__footer {
  margin-top: var(--space-4);
  font-size: var(--font-size-sm);
  text-align: center;
  color: var(--color-text-muted);
}

.auth-form__footer a {
  color: #0095f6;
  font-weight: 600;
}
</style>
