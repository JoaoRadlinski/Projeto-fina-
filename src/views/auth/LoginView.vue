<template>
  <div class="auth">


    <div class="auth__painel-imagem">
      <div class="image-overlay"></div>
      <div class="image-conteudo">
        <div class="image-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          <span>Insta</span>
        </div>
        <div class="comentario_imagem">
          <h2>Capture cada<br>momento</h2>
          <p>Compartilhe sua história e conecte-se com as pessoas que você ama.</p>
        </div>
      </div>
    </div>


    <div class="auth__form-panel">
      <div class="auth-form">

        <p class="auth-form__nav">
          Não tem uma conta?
          <RouterLink :to="{ name: 'cadastro' }">Cadastre-se</RouterLink>
        </p>

        <div class="auth-form__body">
          <div class="logo">
            <div class="logo__icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white"
                stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <h1 class="logo__nome">InstaClone</h1>
            <p class="logo__tagline">Bem-vindo de volta</p>
          </div>

          <form @submit.prevent="handleLogin">

            <div class="campo">
              <span class="campo__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                v-model="form.email"
                class="campo__input"
                type="email"
                placeholder="Seu e-mail"
                autocomplete="email"
                :disabled="loading"
                required
              />
            </div>


            <div class="campo">
              <span class="campo__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                v-model="form.password"
                class="campo__input"
                :type="showPass ? 'text' : 'password'"
                placeholder="Senha"
                autocomplete="current-password"
                :disabled="loading"
                required
              />
              <button type="button" class="campo__eye-toggle" @click="showPass = !showPass">
                <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>

            <p v-if="erro" class="error-alert">{{ erro }}</p>

            <button class="submit-btn" type="submit" :disabled="loading">
              <span v-if="!loading">Entrar</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { extractErrorMessage } from '@/services/api.js'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const erro = ref('')
const showPass = ref(false)

const form = reactive({ email: '', password: '' })

const errosPT = {
  'These credentials do not match our records.': 'E-mail ou senha incorretos.',
  'The password is incorrect.': 'Senha incorreta.',
  'The provided credentials are incorrect.': 'E-mail ou senha incorretos.',
  'Too many login attempts. Please try again in': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  'The email field is required.': 'O campo e-mail é obrigatório.',
  'The email must be a valid email address.': 'Informe um e-mail válido.',
  'The password field is required.': 'O campo senha é obrigatório.',
  'User not found.': 'Nenhuma conta encontrada com esse e-mail.',
  'Unauthorized': 'E-mail ou senha incorretos.',
}

function traduzirErro(err) {
  const raw = extractErrorMessage(err, 'Erro ao entrar. Tente novamente.')
  for (const [en, pt] of Object.entries(errosPT)) {
    if (raw.startsWith(en) || raw === en) return pt
  }
  return raw
}

async function handleLogin() {
  erro.value = ''
  loading.value = true
  try {
    await auth.login({ email: form.email, password: form.password })
    router.push({ name: 'feed' })
  } catch (err) {
    erro.value = traduzirErro(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.auth__painel-imagem {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-image: url('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: stretch;
}

@media (max-width: 767px) {
  .auth__painel-imagem {
    display: none;
  }
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,.25) 0%, rgba(0,0,0,.15) 40%, rgba(0,0,0,.7) 100%);
  z-index: 1;
}

.image-conteudo {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 36px 40px;
  width: 100%;
  color: #fff;
}

.image-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 4px rgba(0,0,0,.4);
}

.comentario_imagem {
  max-width: 340px;
}

.comentario_imagem h2 {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 12px;
  text-shadow: 0 2px 12px rgba(0,0,0,.5);
}

.comentario_imagem p {
  font-size: 15px;
  color: rgba(255,255,255,.75);
  line-height: 1.7;
  text-shadow: 0 1px 6px rgba(0,0,0,.4);
}

.auth__form-panel {
  width: 480px;
  flex-shrink: 0;
  background: var(--color-bg);
  display: flex;
  align-items: stretch;
}

@media (max-width: 767px) {
  .auth__form-panel {
    width: 100%;
    flex: 1;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 28px 52px;
}

.auth-form__nav {
  text-align: right;
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: auto;
}

.auth-form__nav a {
  color: var(--color-accent);
  font-weight: 700;
  margin-left: 4px;
  text-decoration: none;
}

.auth-form__nav a:hover {
  opacity: .8;
}

.auth-form__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 0 48px;
}

.logo {
  margin-bottom: 32px;
}

.logo__icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 28px rgba(220,39,67,.32);
}

.logo__nome {
  font-size: 34px;
  font-family: 'Billabong', 'Grand Hotel', cursive;
  letter-spacing: 1.5px;
  color: var(--color-text);
  margin-bottom: 4px;
  line-height: 1;
}

.logo__tagline {
  font-size: 14px;
  color: var(--color-text-muted);
}

.campo {
  position: relative;
  margin-bottom: 12px;
}

.campo__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color .15s;
}

.campo:focus-within .campo__icon {
  color: var(--color-accent);
}

.campo__input {
  display: block;
  width: 100%;
  padding: 14px 44px 14px 42px;
  background: var(--color-surface-alt);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  transition: border-color .15s, background .15s, box-shadow .15s;
}

.campo__input:focus {
  background: var(--color-surface);
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(225,48,108,.1);
}

.campo__input::placeholder {
  color: var(--color-text-muted);
}

.campo__input:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.campo__eye-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  padding: 4px;
  transition: color .15s;
}

.campo__eye-toggle:hover {
  color: var(--color-text);
}

.error-alert {
  font-size: 12.5px;
  color: var(--color-error);
  margin-bottom: 12px;
  padding: 10px 14px;
  background: rgba(237,73,86,.08);
  border-radius: 10px;
  border-left: 3px solid var(--color-error);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  background-size: 300% auto;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: background-position .5s ease, box-shadow .2s, opacity .15s, transform .1s;
  box-shadow: 0 4px 20px rgba(220,39,67,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

.submit-btn:hover:not(:disabled) {
  background-position: right center;
  box-shadow: 0 8px 30px rgba(220,39,67,.45);
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>