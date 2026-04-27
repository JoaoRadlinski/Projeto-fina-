import axios from 'axios'

export const TOKEN_KEY = 'instaclone.token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request: injeta o token JWT em toda requisição ──────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response: 401 → limpa sessão e redireciona para login ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      import('@/router').then(({ default: router }) => {
        if (router.currentRoute.value.name !== 'login') {
          router.push({ name: 'login' })
        }
      })
    }
    return Promise.reject(error)
  }
)

/**
 * Extrai a mensagem de erro mais amigável de uma resposta da API.
 * Suporta erros de campo do Laravel (errors.field[0]) e mensagem única.
 */
export function extractErrorMessage(error, fallback = 'Ocorreu um erro. Tente novamente.') {
  const data = error?.response?.data
  if (!data) return error?.message ?? fallback

  // Erros de validação do Laravel: { errors: { campo: ['msg'] } }
  if (data.errors) {
    const firstField = Object.values(data.errors)[0]
    if (Array.isArray(firstField) && firstField.length > 0) {
      return firstField[0]
    }
  }

  return data.message ?? fallback
}

export default api
