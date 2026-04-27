import api from './api.js'

export const followsService = {
  follow(userId) {
    return api.post(`/users/${userId}/follow`)
  },

  unfollow(userId) {
    return api.delete(`/users/${userId}/unfollow`)
  },

  getFollowers(userId) {
    return api.get(`/users/${userId}/followers`)
  },

  getFollowing(userId) {
    return api.get(`/users/${userId}/following`)
  },

  isFollowing(userId) {
    return api.get(`/users/${userId}/is-following`)
  },
}
