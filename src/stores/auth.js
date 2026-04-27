import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TOKEN_KEY } from '@/services/api.js'
import { authService } from '@/services/auth.service.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem(TOKEN_KEY) ?? null)

  const isAuthenticated = computed(() => !!token.value)

  function setSession(accessToken, userData) {
    token.value = accessToken
    user.value = userData
    localStorage.setItem(TOKEN_KEY, accessToken)
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function login(credentials) {
    const { data } = await authService.login(credentials)
    setSession(data.access_token, data.user)
  }

  async function register(payload) {
    const { data } = await authService.register(payload)
    setSession(data.access_token, data.user)
  }

  async function logout() {
    try {
      await authService.logout()
    } catch {
      // Ignora erro — token pode ja estar expirado
    } finally {
      clearSession()
    }
  }

  async function fetchMe() {
    const { data } = await authService.me()
    user.value = data
  }

  // Atualiza campos do usuario no store sem nova requisicao
  function patchUser(fields) {
    if (user.value) {
      user.value = { ...user.value, ...fields }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchMe,
    patchUser,
    clearSession,
  }
})
