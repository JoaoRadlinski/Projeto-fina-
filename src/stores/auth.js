import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { TOKEN_KEY } from '@/services/api'
function normalizeUser(raw) {
  return raw?.data ?? raw ?? null
}

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const token = ref(localStorage.getItem(TOKEN_KEY) ?? null)

  const isAuthenticated = computed(() => !!token.value)

  function setSession(accessToken, rawUser) {
    token.value = accessToken
    user.value  = normalizeUser(rawUser)
    localStorage.setItem(TOKEN_KEY, accessToken)
  }

  function clearSession() {
    token.value = null
    user.value  = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    const payload = data?.data ?? data
    setSession(payload.access_token, payload.user)
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload)
    const response = data?.data ?? data
    setSession(response.access_token, response.user)
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch {
    } finally {
      clearSession()
    }
  }

  async function fetchMe() {
    const { data } = await api.get('/auth/me')
    user.value = normalizeUser(data)
  }

  async function updateProfile(payload) {
    const { data } = await api.put('/users/me', payload)
    user.value = normalizeUser(data)
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchMe,
    updateProfile,
    clearSession,
  }
})
