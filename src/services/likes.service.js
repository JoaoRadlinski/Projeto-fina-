import api from './api.js'

export const likesService = {
  like(postId) {
    return api.post(`/posts/${postId}/like`)
  },
  unlike(postId) {
    return api.delete(`/posts/${postId}/unlike`)
  },
  getLikes(postId) {
    return api.get(`/posts/${postId}/likes`)
  },
}
