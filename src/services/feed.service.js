import api from './api.js'

export const feedService = {
  // Paginacao por cursor: passa cursor=<id> para buscar a proxima pagina
  getFeed(cursor = null) {
    const params = cursor ? { cursor } : {}
    return api.get('/feed', { params })
  },
}
