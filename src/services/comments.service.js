import api from './api.js'

export const commentsService = {
  getByPost(postId) {
    return api.get(`/posts/${postId}/comments`)
  },

  create(postId, payload) {
    return api.post(`/posts/${postId}/comments`, payload)
  },

  update(commentId, payload) {
    return api.put(`/comments/${commentId}`, payload)
  },

  delete(commentId) {
    return api.delete(`/comments/${commentId}`)
  },
}
