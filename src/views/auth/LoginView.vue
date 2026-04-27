<template>
  <div class="auth">
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
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div class="post__likes">127 curtidas</div>
              <div class="post__caption"><span class="post__caption-author">você</span> Novo começo ✨</div>
            </div>
          </div>
        </div>
        <h2 class="panel-title">Capture every<br>moment</h2>
        <p class="panel-subtitle">Compartilhe sua história e conecte-se com quem você ama.</p>
      </div>
    </div>

    <div class="auth__panel auth__panel--light">
      <div class="auth-form">
        <p class="auth-form__nav">
          Não tem uma conta?
          <RouterLink :to="{ name: 'cadastro' }">Cadastre-se</RouterLink>
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input v-model="form.email" class="field__input" type="email" placeholder="Email" autocomplete="email" :disabled="loading" required />
            </div>
            <div class="field">
              <span class="field__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input v-model="form.password" class="field__input" :type="showPass ? 'text' : 'password'" placeholder="Senha" autocomplete="current-password" :disabled="loading" required />
              <button type="button" class="field__eye-toggle" @click="showPass = !showPass">
                <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <p v-if="error" class="error-alert">{{ error }}</p>
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
import { useAuthStore } from '@/stores/auth'

const router   = useRouter()
const auth     = useAuthStore()
const loading  = ref(false)
const error    = ref('')
const showPass = ref(false)
const form     = reactive({ email: '', password: '' })

async function handleLogin() {
  error.value = ''
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
.auth { display: flex; width: 100%; min-height: 100vh; }
.auth__panel { flex: 1; display: flex; position: relative; overflow: hidden; }
.auth__panel--dark { background: #07070f; align-items: center; justify-content: center; }
@media (max-width: 767px) { .auth__panel--dark { display: none; } }
.bg-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; animation: orb-float 10s ease-in-out infinite; }
.bg-orb--1 { width: 400px; height: 400px; background: radial-gradient(circle,rgba(188,24,136,.55),transparent 70%); top: -120px; left: -100px; }
.bg-orb--2 { width: 300px; height: 300px; background: radial-gradient(circle,rgba(230,80,40,.45),transparent 70%); bottom: -60px; right: -60px; animation-delay: -4s; }
.bg-orb--3 { width: 220px; height: 220px; background: radial-gradient(circle,rgba(60,100,220,.3),transparent 70%); top: 45%; left: 15%; animation-delay: -7s; }
@keyframes orb-float { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-28px) scale(1.06); } }
.dark-panel { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 48px 40px; max-width: 400px; color: #fff; z-index: 1; }
.phone { position: relative; width: 195px; height: 380px; background: linear-gradient(170deg,#181830 0%,#0c0c1e 100%); border-radius: 34px; border: 1.5px solid rgba(255,255,255,.1); box-shadow: 0 0 0 1px rgba(255,255,255,.04) inset, 0 40px 80px rgba(0,0,0,.85), 0 0 80px rgba(188,24,136,.12); margin-bottom: 36px; overflow: hidden; }
.phone__notch { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 44px; height: 4px; background: rgba(255,255,255,.14); border-radius: 2px; z-index: 2; }
.phone__screen { position: absolute; inset: 22px 10px 10px; display: flex; flex-direction: column; gap: 8px; }
.phone__header { display: flex; align-items: center; justify-content: space-between; padding: 0 2px; }
.phone__brand { font-size: 9.5px; font-weight: 700; color: #fff; letter-spacing: .4px; }
.phone__icons { display: flex; gap: 7px; align-items: center; }
.phone__stories { display: flex; gap: 8px; padding: 2px 0; }
.story { width: 34px; height: 34px; border-radius: 50%; padding: 2px; flex-shrink: 0; }
.story--orange { background: linear-gradient(135deg,#f09433,#dc2743); }
.story--purple { background: linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045); }
.story--blue   { background: linear-gradient(135deg,#4facfe,#00f2fe); }
.story--green  { background: linear-gradient(135deg,#43e97b,#38f9d7); }
.story__avatar { width: 100%; height: 100%; border-radius: 50%; background: #141428; }
.post { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.post__header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.post__avatar { width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg,#f09433,#dc2743); flex-shrink: 0; }
.post__username { font-size: 8.5px; font-weight: 600; color: rgba(255,255,255,.85); flex: 1; }
.post__menu { font-size: 11px; color: rgba(255,255,255,.4); letter-spacing: 1px; line-height: 1; }
.post__photo { flex: 1; border-radius: 8px; background: linear-gradient(145deg,#667eea,#764ba2,#f64f59,#c471ed); background-size: 200% 200%; animation: gradient-shift 5s ease infinite; min-height: 0; }
@keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.post__actions { display: flex; gap: 8px; padding: 5px 0 2px; }
.post__likes { font-size: 7.5px; font-weight: 600; color: rgba(255,255,255,.7); margin-bottom: 2px; }
.post__caption { font-size: 7px; color: rgba(255,255,255,.45); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.post__caption-author { font-weight: 700; color: rgba(255,255,255,.7); }
.panel-title { font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 12px; background: linear-gradient(135deg,#fff 30%,rgba(255,255,255,.45)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.panel-subtitle { font-size: 13px; color: rgba(255,255,255,.38); line-height: 1.75; margin-bottom: 32px; max-width: 260px; }
.auth__panel--light { background: #fafafa; align-items: stretch; }
.auth-form { display: flex; flex-direction: column; width: 100%; max-width: 420px; min-height: 100vh; padding: 28px 48px; margin: 0 auto; }
.auth-form__nav { text-align: right; font-size: 13px; color: var(--color-text-muted); margin-bottom: auto; }
.auth-form__nav a { color: var(--color-accent); font-weight: 700; margin-left: 4px; text-decoration: none; }
.auth-form__nav a:hover { opacity: .8; }
.auth-form__body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 16px 0 48px; }
.brand { margin-bottom: 32px; }
.brand__icon { width: 54px; height: 54px; border-radius: 18px; background: linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 8px 28px rgba(220,39,67,.32); }
.brand__name { font-size: 34px; font-family: 'Billabong','Grand Hotel',cursive; letter-spacing: 1.5px; color: var(--color-text); margin-bottom: 4px; line-height: 1; }
.brand__tagline { font-size: 14px; color: var(--color-text-muted); }
.field { position: relative; margin-bottom: 12px; }
.field__icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #bbb; display: flex; align-items: center; pointer-events: none; transition: color .15s; }
.field:focus-within .field__icon { color: var(--color-accent); }
.field__input { display: block; width: 100%; padding: 14px 44px 14px 42px; background: #f0f0f0; border: 1.5px solid transparent; border-radius: 12px; font-size: 14px; color: var(--color-text); outline: none; transition: border-color .15s,background .15s,box-shadow .15s; }
.field__input:focus { background: #fff; border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(225,48,108,.1); }
.field__input::placeholder { color: #bbb; }
.field__input:disabled { opacity: .6; cursor: not-allowed; }
.field__eye-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #bbb; display: flex; align-items: center; padding: 4px; transition: color .15s; }
.field__eye-toggle:hover { color: #666; }
.error-alert { font-size: 12.5px; color: var(--color-error); margin-bottom: 10px; padding: 10px 14px; background: rgba(237,73,86,.08); border-radius: 10px; border-left: 3px solid var(--color-error); }
.submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); background-size: 300% auto; color: #fff; font-size: 15px; font-weight: 700; border-radius: 12px; border: none; cursor: pointer; transition: background-position .5s ease,box-shadow .2s,opacity .15s,transform .1s; box-shadow: 0 4px 20px rgba(220,39,67,.35); display: flex; align-items: center; justify-content: center; min-height: 50px; }
.submit-btn:hover:not(:disabled) { background-position: right center; box-shadow: 0 8px 30px rgba(220,39,67,.45); transform: translateY(-1px); }
.submit-btn:disabled { opacity: .55; cursor: not-allowed; }
.loading-spinner { display: inline-block; width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
