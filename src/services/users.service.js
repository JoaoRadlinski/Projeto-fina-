import api from './api.js'

export const usersService = {
  getByUsername(username) {
    return api.get(`/users/${username}`)
  },
  updateMe(payload) {
    return api.put('/users/me', payload)
  },
  updateAvatar(formData) {
    return api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  search(query) {
    return api.get('/users/search', { params: { q: query } })
  },
  suggestions() {
    return api.get('/users/suggestions')
  },
  getPostsById(userId) {
    return api.get(`/users/${userId}/posts`)
  },
}
