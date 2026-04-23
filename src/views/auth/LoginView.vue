<template>
  <div class="auth">

    <!-- Painel escuro -->
    <div class="auth__panel auth__panel--dark">
      <div class="bg-orb bg-orb--1"></div>
      <div class="bg-orb bg-orb--2"></div>
      <div class="bg-orb bg-orb--3"></div>

      <div class="dark-panel">
        <div class="phone">
          <div class="phone__notch"></div>
          <div class="phone__screen">

            <div class="phone__header">
              <span class="phone__brand">InstaClone</span>
              <div class="phone__icons">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
            </div>

            <div class="phone__stories">
              <div class="story story--orange"><div class="story__avatar"></div></div>
              <div class="story story--purple"><div class="story__avatar"></div></div>
              <div class="story story--blue"><div class="story__avatar"></div></div>
              <div class="story story--green"><div class="story__avatar"></div></div>
            </div>

            <div class="post">
              <div class="post__header">
                <div class="post__avatar"></div>
                <span class="post__username">você</span>
                <span class="post__menu">···</span>
              </div>
              <div class="post__photo"></div>
              <div class="post__actions">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </div>
              <div class="post__likes">127 curtidas</div>
              <div class="post__caption">
                <span class="post__caption-author">você</span> Novo começo ✨
              </div>
            </div>

          </div>
        </div>

        <h2 class="panel-title">Capture every<br>moment</h2>
        <p class="panel-subtitle">Compartilhe sua história e conecte-se com quem você ama.</p>

        <div class="stats">
          <div class="stats__item">
            <span class="stats__number">2M+</span>
            <span class="stats__label">Usuários</span>
          </div>
          <div class="stats__divider"></div>
          <div class="stats__item">
            <span class="stats__number">10M+</span>
            <span class="stats__label">Fotos</span>
          </div>
          <div class="stats__divider"></div>
          <div class="stats__item">
            <span class="stats__number">50M+</span>
            <span class="stats__label">Curtidas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Painel claro -->
    <div class="auth__panel auth__panel--light">
      <div class="auth-form">

        <p class="auth-form__nav">
          Não tem uma conta?
          <RouterLink to="/cadastro">Cadastre-se</RouterLink>
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
            <p class="brand__tagline">Bem-vindo de volta</p>
          </div>

          <form @submit.prevent="handleLogin">
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
                placeholder="Email ou usuário"
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
                placeholder="Senha"
                autocomplete="current-password"
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

            <div class="forgot-link">
              <a href="#">Esqueceu a senha?</a>
            </div>

            <p v-if="error" class="error-alert">{{ error }}</p>

            <button class="submit-btn" type="submit" :disabled="loading">
              <span v-if="!loading">Entrar</span>
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
const form     = reactive({ email: '', password: '' })

async function handleLogin() {
  error.value   = ''
  loading.value = true
  try {
    await auth.login(form)
    router.push({ name: 'feed' })
  } catch (err) {
    error.value = err.response?.data?.message ?? 'Erro ao entrar. Tente novamente.'
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
  top: -120px; left: -100px;
  animation-delay: 0s;
}

.bg-orb--2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(230, 80, 40, 0.45), transparent 70%);
  bottom: -60px; right: -60px;
  animation-delay: -4s;
}

.bg-orb--3 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(60, 100, 220, 0.3), transparent 70%);
  top: 45%; left: 15%;
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

/* ── Mockup de celular ───────────────────────────────────────────────── */
.phone {
  position: relative;
  width: 195px;
  height: 380px;
  background: linear-gradient(170deg, #181830 0%, #0c0c1e 100%);
  border-radius: 34px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 40px 80px rgba(0, 0, 0, 0.85),
    0 0 80px rgba(188, 24, 136, 0.12);
  margin-bottom: 36px;
  overflow: hidden;
}

.phone__notch {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 44px;
  height: 4px;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 2px;
  z-index: 2;
}

.phone__screen {
  position: absolute;
  inset: 22px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.phone__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
}

.phone__brand {
  font-size: 9.5px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.4px;
}

.phone__icons {
  display: flex;
  gap: 7px;
  align-items: center;
}

/* Stories */
.phone__stories {
  display: flex;
  gap: 8px;
  padding: 2px 0;
}

.story {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  padding: 2px;
  flex-shrink: 0;
}

.story--orange { background: linear-gradient(135deg, #f09433, #dc2743); }
.story--purple { background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); }
.story--blue   { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.story--green  { background: linear-gradient(135deg, #43e97b, #38f9d7); }

.story__avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #141428;
}

/* Post preview */
.post {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.post__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.post__avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f09433, #dc2743);
  flex-shrink: 0;
}

.post__username {
  font-size: 8.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  flex: 1;
}

.post__menu {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
  line-height: 1;
}

.post__photo {
  flex: 1;
  border-radius: 8px;
  background: linear-gradient(145deg, #667eea, #764ba2, #f64f59, #c471ed);
  background-size: 200% 200%;
  animation: gradient-shift 5s ease infinite;
  min-height: 0;
}

@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.post__actions {
  display: flex;
  gap: 8px;
  padding: 5px 0 2px;
}

.post__likes {
  font-size: 7.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2px;
}

.post__caption {
  font-size: 7px;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post__caption-author {
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
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
  margin-bottom: 32px;
  max-width: 260px;
}

/* Estatísticas */
.stats {
  display: flex;
  align-items: center;
  gap: 28px;
}

.stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stats__number {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.stats__label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.32);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.stats__divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
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
  padding: 16px 0 48px;
}

/* Marca / logo */
.brand {
  margin-bottom: 32px;
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
  margin-bottom: 12px;
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
}

.field:focus-within .field__icon {
  color: var(--color-accent);
}

.field__input {
  display: block;
  width: 100%;
  padding: 14px 44px 14px 42px;
  background: #f0f0f0;
  border: 1.5px solid transparent;
  border-radius: 12px;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
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

/* Link "Esqueceu a senha" */
.forgot-link {
  text-align: right;
  margin-top: -4px;
  margin-bottom: 20px;
}

.forgot-link a {
  font-size: 12px;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s;
}

.forgot-link a:hover { color: var(--color-accent); }

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
  margin: 26px 0;
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
