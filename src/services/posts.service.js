import api from './api.js'

export const postsService = {
  create(formData) {
    return api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getById(postId) {
    return api.get(`/posts/${postId}`)
  },

  update(postId, payload) {
    return api.put(`/posts/${postId}`, payload)
  },

  delete(postId) {
    return api.delete(`/posts/${postId}`)
  },
}
