import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { TOKEN_KEY } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const token = ref(localStorage.getItem(TOKEN_KEY) ?? null)

  const isAuthenticated = computed(() => !!token.value)

  function setSession(accessToken, userData) {
    token.value = accessToken
    user.value  = userData
    localStorage.setItem(TOKEN_KEY, accessToken)
  }

  function clearSession() {
    token.value = null
    user.value  = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    setSession(data.access_token, data.user)
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload)
    setSession(data.access_token, data.user)
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignora erro — token pode já ter expirado
    } finally {
      clearSession()
    }
  }

  async function fetchMe() {
    const { data } = await api.get('/auth/me')
    user.value = data
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchMe,
    clearSession,
  }
})
