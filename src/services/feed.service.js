import api from './api.js'
export const feedService = {
  getFeed(cursor = null) {
    const params = cursor ? { cursor } : {}
    return api.get('/feed', { params })
  },
}
