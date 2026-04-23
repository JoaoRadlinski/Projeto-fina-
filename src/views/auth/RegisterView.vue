<template>
  <div class="auth">

    <!-- Painel escuro -->
    <div class="auth__panel auth__panel--dark">
      <div class="bg-orb bg-orb--1"></div>
      <div class="bg-orb bg-orb--2"></div>
      <div class="bg-orb bg-orb--3"></div>

      <div class="dark-panel">
        <div class="photo-gallery">
          <div class="photo-gallery__cell photo-gallery__cell--a"></div>
          <div class="photo-gallery__cell photo-gallery__cell--b"></div>
          <div class="photo-gallery__cell photo-gallery__cell--c"></div>
          <div class="photo-gallery__cell photo-gallery__cell--d"></div>
          <div class="photo-gallery__cell photo-gallery__cell--e"></div>
          <div class="photo-gallery__cell photo-gallery__cell--f"></div>
          <div class="photo-gallery__cell photo-gallery__cell--g"></div>
          <div class="photo-gallery__cell photo-gallery__cell--h"></div>
          <div class="photo-gallery__cell photo-gallery__cell--i"></div>
        </div>

        <h2 class="panel-title">Join the<br>community</h2>
        <p class="panel-subtitle">Crie sua conta e comece a compartilhar seus melhores momentos.</p>

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

    <!-- Painel claro -->
    <div class="auth__panel auth__panel--light">
      <div class="auth-form">

        <p class="auth-form__nav">
          Já tem uma conta?
          <RouterLink to="/login">Entrar</RouterLink>
        </p>

        <div class="auth-form__body">
          <div class="brand">
            <div class="brand__icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </div>
            <h1 class="brand__name">InstaClone</h1>
            <p class="brand__tagline">Crie sua conta gratuitamente</p>
          </div>

          <form @submit.prevent="handleRegister">
            <div class="field">
              <span class="field__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                v-model="form.name"
                class="field__input"
                type="text"
                placeholder="Nome completo"
                autocomplete="name"
                :disabled="loading"
                required
              />
            </div>

            <div class="field">
              <span class="field__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
                </svg>
              </span>
              <span class="field__prefix">@</span>
              <input
                v-model="form.username"
                class="field__input field__input--with-prefix"
                type="text"
                placeholder="nome_de_usuario"
                autocomplete="username"
                :disabled="loading"
                required
              />
            </div>

            <div class="field">
              <span class="field__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                v-model="form.email"
                class="field__input"
                type="email"
                placeholder="Seu email"
                autocomplete="email"
                :disabled="loading"
                required
              />
            </div>

            <div class="field">
              <span class="field__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                v-model="form.password"
                class="field__input"
                :type="showPass ? 'text' : 'password'"
                placeholder="Crie uma senha"
                autocomplete="new-password"
                :disabled="loading"
                required
              />
              <button
                type="button"
                class="field__eye-toggle"
                @click="showPass = !showPass"
                :aria-label="showPass ? 'Ocultar senha' : 'Mostrar senha'"
              >
                <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>

            <div class="field">
              <span class="field__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                v-model="form.password_confirmation"
                class="field__input"
                :type="showPass ? 'text' : 'password'"
                placeholder="Confirme a senha"
                autocomplete="new-password"
                :disabled="loading"
                required
              />
            </div>

            <p class="terms-notice">
              Ao se cadastrar, você concorda com nossos
              <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a>.
            </p>

            <p v-if="error" class="error-alert">{{ error }}</p>

            <button class="submit-btn" type="submit" :disabled="loading">
              <span v-if="!loading">Criar conta</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>

          <div class="or-divider"><span>ou continue com</span></div>

          <div class="social-login">
            <button class="social-login__btn" type="button" disabled>
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button class="social-login__btn" type="button" disabled>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router   = useRouter()
const auth     = useAuthStore()
const loading  = ref(false)
const error    = ref('')
const showPass = ref(false)
const form     = reactive({ name: '', username: '', email: '', password: '', password_confirmation: '' })

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
/* ── Estrutura da página ─────────────────────────────────────────────── */
.auth {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.auth__panel {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* ── Painel escuro ───────────────────────────────────────────────────── */
.auth__panel--dark {
  background: #07070f;
  align-items: center;
  justify-content: center;
}

@media (max-width: 767px) {
  .auth__panel--dark { display: none; }
}

/* Orbs de fundo animados */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  animation: orb-float 10s ease-in-out infinite;
}

.bg-orb--1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(188, 24, 136, 0.55), transparent 70%);
  top: -120px; right: -100px;
  animation-delay: 0s;
}

.bg-orb--2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(230, 80, 40, 0.45), transparent 70%);
  bottom: -60px; left: -60px;
  animation-delay: -4s;
}

.bg-orb--3 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(60, 100, 220, 0.3), transparent 70%);
  top: 45%; right: 15%;
  animation-delay: -7s;
}

@keyframes orb-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50%       { transform: translateY(-28px) scale(1.06); }
}

/* Conteúdo do painel escuro */
.dark-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 40px;
  max-width: 400px;
  color: #fff;
  z-index: 1;
}

/* ── Mini galeria de fotos ───────────────────────────────────────────── */
.photo-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  width: 210px;
  height: 210px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 36px;
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(188, 24, 136, 0.12);
}

.photo-gallery__cell {
  border-radius: 2px;
  background-size: 200% 200%;
  animation: gradient-shift 6s ease infinite;
}

.photo-gallery__cell--a { background: linear-gradient(135deg, #f09433, #dc2743); animation-delay: -0s; }
.photo-gallery__cell--b { background: linear-gradient(135deg, #667eea, #764ba2); animation-delay: -1s; }
.photo-gallery__cell--c { background: linear-gradient(135deg, #4facfe, #00f2fe); animation-delay: -2s; }
.photo-gallery__cell--d { background: linear-gradient(135deg, #43e97b, #38f9d7); animation-delay: -3s; }
.photo-gallery__cell--e { background: linear-gradient(135deg, #fa709a, #fee140); animation-delay: -4s; }
.photo-gallery__cell--f { background: linear-gradient(135deg, #a18cd1, #fbc2eb); animation-delay: -5s; }
.photo-gallery__cell--g { background: linear-gradient(135deg, #fccb90, #d57eeb); animation-delay: -1.5s; }
.photo-gallery__cell--h { background: linear-gradient(135deg, #84fab0, #8fd3f4); animation-delay: -2.5s; }
.photo-gallery__cell--i { background: linear-gradient(135deg, #f093fb, #f5576c); animation-delay: -3.5s; }

@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Título e subtítulo do painel */
.panel-title {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ffffff 30%, rgba(255, 255, 255, 0.45));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.38);
  line-height: 1.75;
  margin-bottom: 28px;
  max-width: 260px;
}

/* Lista de benefícios */
.perks {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.perk {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
}

.perk__dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f09433, #dc2743);
}

/* ── Painel claro ────────────────────────────────────────────────────── */
.auth__panel--light {
  background: #fafafa;
  align-items: stretch;
}

.auth-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 420px;
  min-height: 100vh;
  padding: 28px 48px;
  margin: 0 auto;
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
  transition: opacity 0.15s;
}

.auth-form__nav a:hover { opacity: 0.8; }

.auth-form__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 0 40px;
}

/* Marca / logo */
.brand {
  margin-bottom: 28px;
}

.brand__icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 28px rgba(220, 39, 67, 0.32);
}

.brand__name {
  font-size: 34px;
  font-family: 'Billabong', 'Grand Hotel', cursive;
  letter-spacing: 1.5px;
  color: var(--color-text);
  margin-bottom: 4px;
  line-height: 1;
}

.brand__tagline {
  font-size: 14px;
  color: var(--color-text-muted);
}

/* ── Campos de formulário ────────────────────────────────────────────── */
.field {
  position: relative;
  margin-bottom: 10px;
}

.field__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #bbb;
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.15s;
  z-index: 1;
}

.field:focus-within .field__icon {
  color: var(--color-accent);
}

.field__prefix {
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #aaa;
  pointer-events: none;
  z-index: 1;
  transition: color 0.15s;
}

.field:focus-within .field__prefix {
  color: var(--color-accent);
}

.field__input {
  display: block;
  width: 100%;
  padding: 13px 44px 13px 42px;
  background: #f0f0f0;
  border: 1.5px solid transparent;
  border-radius: 12px;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.field__input--with-prefix {
  padding-left: 52px;
}

.field__input:focus {
  background: #fff;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(225, 48, 108, 0.1);
}

.field__input::placeholder { color: #bbb; }
.field__input:disabled { opacity: 0.6; cursor: not-allowed; }

.field__eye-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #bbb;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: color 0.15s;
}

.field__eye-toggle:hover { color: #666; }

/* Aviso de termos */
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

.terms-notice a:hover { text-decoration: underline; }

/* Mensagem de erro */
.error-alert {
  font-size: 12.5px;
  color: var(--color-error);
  margin-bottom: 10px;
  padding: 10px 14px;
  background: rgba(237, 73, 86, 0.08);
  border-radius: 10px;
  border-left: 3px solid var(--color-error);
}

/* Botão de envio */
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
  transition: background-position 0.5s ease, box-shadow 0.2s, opacity 0.15s, transform 0.1s;
  box-shadow: 0 4px 20px rgba(220, 39, 67, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

.submit-btn:hover:not(:disabled) {
  background-position: right center;
  box-shadow: 0 8px 30px rgba(220, 39, 67, 0.45);
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

/* Spinner de carregamento */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divisor "ou" */
.or-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0;
  color: #ccc;
  font-size: 12px;
}

.or-divider::before,
.or-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ebebeb;
}

/* Botões de login social */
.social-login {
  display: flex;
  gap: 12px;
}

.social-login__btn {
  flex: 1;
  padding: 11px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: not-allowed;
  opacity: 0.6;
  background: #fff;
}
</style>
