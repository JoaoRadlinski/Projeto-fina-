import axios from 'axios'

export const TOKEN_KEY = 'instaclone.token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request: injeta o token quando existir ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response: trata 401 limpando sessão e redirecionando ────────────────────
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

// Helper para extrair mensagem amigável de erros da API
export function extractErrorMessage(error, fallback = 'Ocorreu um erro. Tente novamente.') {
  return error?.response?.data?.message ?? error?.message ?? fallback
}

export { TOKEN_KEY as default_key }
export default api
