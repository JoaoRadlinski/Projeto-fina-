import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useFollowsStore = defineStore('follows', () => {
  const followingIds = ref(new Set())
  const pendingIds   = ref(new Set())

  function isFollowing(userId) { return followingIds.value.has(userId) }
  function isPending(userId)   { return pendingIds.value.has(userId) }

  async function follow(userId) {
    if (pendingIds.value.has(userId)) return
    pendingIds.value   = new Set([...pendingIds.value, userId])
    followingIds.value = new Set([...followingIds.value, userId])
    try {
      await api.post(`/users/${userId}/follow`)
    } catch {
      followingIds.value = new Set([...followingIds.value].filter(id => id !== userId))
    } finally {
      pendingIds.value = new Set([...pendingIds.value].filter(id => id !== userId))
    }
  }

  async function unfollow(userId) {
    if (pendingIds.value.has(userId)) return
    pendingIds.value   = new Set([...pendingIds.value, userId])
    followingIds.value = new Set([...followingIds.value].filter(id => id !== userId))
    try {
      await api.delete(`/users/${userId}/unfollow`)
    } catch {
      followingIds.value = new Set([...followingIds.value, userId])
    } finally {
      pendingIds.value = new Set([...pendingIds.value].filter(id => id !== userId))
    }
  }

  function setFollowingIds(ids = []) {
    followingIds.value = new Set(ids)
  }

  return { followingIds, pendingIds, isFollowing, isPending, follow, unfollow, setFollowingIds }
})
