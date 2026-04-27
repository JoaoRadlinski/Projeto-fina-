// =============================================================================
// api.js — Instância central do Axios para comunicação com o backend
//
// Todos os arquivos de service importam "api" daqui.
// Esse módulo também cuida de duas coisas automáticas:
//   1. Colocar o token JWT no cabeçalho de TODA requisição
//   2. Deslogar o usuário automaticamente quando a API retornar 401 (não autorizado)
// =============================================================================

import axios from 'axios'
import { ROUTE_NAMES } from '@/router/routeNames.js'

// Chave usada para guardar e ler o token JWT no localStorage do navegador
export const TOKEN_KEY = 'lumeo.token'

// Cria a instância do Axios com a URL base da API
// O operador ?? significa: se VITE_API_URL não estiver definido no .env, usa o fallback
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// -----------------------------------------------------------------------------
// Interceptor de REQUISIÇÃO
// Roda antes de cada chamada ser enviada ao servidor.
// Lê o token do localStorage e injeta no header Authorization.
// Sem isso, a API rejeitaria as requisições de usuários logados.
// -----------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config // sempre retorna a config para a requisição continuar
})

// -----------------------------------------------------------------------------
// Interceptor de RESPOSTA
// Roda depois de cada resposta recebida do servidor.
// Se a API retornar 401 (token expirado ou inválido), limpa os dados da sessão
// e redireciona o usuário para a tela de login automaticamente.
// -----------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response, // resposta OK: apenas repassa sem modificar
  (error) => {
    if (error.response?.status === 401) {
      // Remove o token inválido do localStorage
      localStorage.removeItem(TOKEN_KEY)

      // Importação dinâmica do router para evitar dependência circular:
      // api.js → router → api.js (seria um loop). Com import() dinâmico isso não acontece.
      import('@/router').then(({ default: router }) => {
        // Só redireciona se o usuário não estiver já na tela de login
        if (router.currentRoute.value.name !== ROUTE_NAMES.LOGIN) {
          router.push({ name: ROUTE_NAMES.LOGIN })
        }
      })
    }
    return Promise.reject(error) // repassa o erro para o código que fez a chamada tratar
  }
)

// -----------------------------------------------------------------------------
// extractErrorMessage — helper para extrair mensagens de erro de forma amigável
//
// A API pode retornar o erro em formatos diferentes dependendo do endpoint.
// Essa função tenta as fontes na ordem:
//   1. error.response.data.message → mensagem do servidor (mais específica)
//   2. error.message → mensagem do Axios (ex: "Network Error")
//   3. fallback → texto padrão passado por quem chamou
// -----------------------------------------------------------------------------
export function extractErrorMessage(error, fallback = 'Algo deu errado. Tente novamente.') {
  return error?.response?.data?.message ?? error?.message ?? fallback
}

export default api
