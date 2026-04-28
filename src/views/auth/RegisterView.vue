<template>
  <div class="auth">


    <div class="auth__image-panel">
      <div class="image-overlay"></div>
      <div class="image-content">
        <div class="image-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          <span>InstaClone</span>
        </div>
        <div class="image-quote">
          <h2>Faça parte da<br>comunidade</h2>
          <p>Crie sua conta e comece a compartilhar seus melhores momentos com o mundo.</p>
          <ul class="perks">
            <li class="perk">
              <span class="perk__dot"></span>
              Compartilhe fotos e vídeos com amigos
            </li>
            <li class="perk">
              <span class="perk__dot"></span>
              Descubra conteúdo que você vai amar
            </li>
            <li class="perk">
              <span class="perk__dot"></span>
              Conecte-se com pessoas do mundo todo
            </li>
          </ul>
        </div>
      </div>
    </div>


    <div class="auth__form-panel">
      <div class="auth-form">

        <p class="auth-form__nav">
          Já tem uma conta?
          <RouterLink :to="{ name: 'login' }">Entrar</RouterLink>
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
            <h1 class="logo__name">InstaClone</h1>
            <p class="logo__tagline">Crie sua conta gratuitamente</p>
          </div>

          <form @submit.prevent="handleRegister">

            <div class="campo">
              <span class="campo__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                v-model="form.name"
                class="campo__input"
                type="text"
                placeholder="Nome completo"
                autocomplete="name"
                :disabled="loading"
                required
              />
            </div>


            <div class="campo">
              <span class="campo__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                </svg>
              </span>
              <span class="campo__prefix">@</span>
              <input
                v-model="form.username"
                class="campo__input campo__input--with-prefix"
                type="text"
                placeholder="nome_de_usuario"
                autocomplete="username"
                :disabled="loading"
                required
              />
            </div>


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
                placeholder="Crie uma senha"
                autocomplete="new-password"
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


            <div class="campo" :class="{ 'campo--error': senhasDivergentes }">
              <span class="campo__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                v-model="form.password_confirmation"
                class="campo__input"
                :type="showPass ? 'text' : 'password'"
                placeholder="Confirme a senha"
                autocomplete="new-password"
                :disabled="loading"
                required
              />
            </div>
            <p v-if="senhasDivergentes" class="campo-hint campo-hint--error">As senhas não coincidem.</p>

            <p class="terms-notice">
              Ao se cadastrar, você concorda com nossos
              <a href="#">Termos de Uso</a>.
            </p>

            <p v-if="erro" class="error-alert">{{ erro }}</p>

            <button class="submit-btn" type="submit" :disabled="loading || senhasDivergentes">
              <span v-if="!loading">Criar conta</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { extractErrorMessage } from '@/services/api.js'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const erro = ref('')
const showPass = ref(false)

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const senhasDivergentes = computed(() =>
  form.password_confirmation.length > 0 && form.password !== form.password_confirmation
)

const errosPT = {
  'The email has already been taken.': 'Este e-mail já está em uso.',
  'The username has already been taken.': 'Este nome de usuário já está em uso.',
  'The name field is required.': 'O campo nome é obrigatório.',
  'The username field is required.': 'O campo usuário é obrigatório.',
  'The email field is required.': 'O campo e-mail é obrigatório.',
  'The email must be a valid email address.': 'Informe um e-mail válido.',
  'The password field is required.': 'O campo senha é obrigatório.',
  'The password must be at least 8 characters.': 'A senha deve ter no mínimo 8 caracteres.',
  'The password confirmation does not match.': 'A confirmação de senha não coincide.',
  'The username may only contain letters, numbers, and underscores.':
    'O nome de usuário pode ter apenas letras, números e underscore.',
}

function traduzirErro(err) {
  const raw = extractErrorMessage(err, 'Não foi possível criar a conta. Tente novamente.')
  for (const [en, pt] of Object.entries(errosPT)) {
    if (raw.startsWith(en) || raw === en) return pt
  }
  return raw
}

async function handleRegister() {
  if (senhasDivergentes.value) return
  erro.value = ''
  loading.value = true
  try {
    await auth.register(form)
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

.auth__image-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-image: url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center top;
  display: flex;
  align-items: stretch;
}

@media (max-width: 767px) {
  .auth__image-panel {
    display: none;
  }
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,.3) 0%, rgba(0,0,0,.1) 35%, rgba(0,0,0,.72) 100%);
  z-index: 1;
}

.image-content {
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

.image-quote {
  max-width: 360px;
}

.image-quote h2 {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 12px;
  text-shadow: 0 2px 12px rgba(0,0,0,.5);
}

.image-quote p {
  font-size: 15px;
  color: rgba(255,255,255,.75);
  line-height: 1.7;
  margin-bottom: 24px;
  text-shadow: 0 1px 6px rgba(0,0,0,.4);
}

.perks {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.perk {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(255,255,255,.65);
  text-shadow: 0 1px 4px rgba(0,0,0,.4);
}

.perk__dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f09433, #dc2743);
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
  padding: 16px 0 40px;
}

.logo {
  margin-bottom: 28px;
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

.logo__name {
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
  margin-bottom: 10px;
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
  z-index: 1;
}

.campo:focus-within .campo__icon {
  color: var(--color-accent);
}

.campo__prefix {
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--color-text-muted);
  pointer-events: none;
  z-index: 1;
}

.campo:focus-within .campo__prefix {
  color: var(--color-accent);
}

.campo__input {
  display: block;
  width: 100%;
  padding: 13px 44px 13px 42px;
  background: var(--color-surface-alt);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  transition: border-color .15s, background .15s, box-shadow .15s;
}

.campo__input--with-prefix {
  padding-left: 52px;
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

.campo--error .campo__input {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(237,73,86,.1);
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

.campo-hint {
  font-size: 12px;
  margin-top: -6px;
  margin-bottom: 10px;
  padding-left: 4px;
}

.campo-hint--error {
  color: var(--color-error);
}

.terms-notice {
  font-size: 11.5px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-top: 4px;
  margin-bottom: 16px;
}

.terms-notice a {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
}

.error-alert {
  font-size: 12.5px;
  color: var(--color-error);
  margin-bottom: 10px;
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