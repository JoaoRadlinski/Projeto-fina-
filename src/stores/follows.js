import { defineStore } from 'pinia'
import { ref } from 'vue'
import { followsService } from '@/services/follows.service.js'

export const useFollowsStore = defineStore('follows', () => {
  // Sets de IDs — substituidos a cada mutacao para preservar reatividade do Pinia
  const followingIds = ref(new Set())
  const pendingIds = ref(new Set())

  function isFollowing(userId) {
    return followingIds.value.has(userId)
  }

  function isPending(userId) {
    return pendingIds.value.has(userId)
  }

  async function follow(userId) {
    if (pendingIds.value.has(userId)) return

    // Otimismo: adiciona antes da API confirmar
    pendingIds.value = new Set([...pendingIds.value, userId])
    followingIds.value = new Set([...followingIds.value, userId])

    try {
      await followsService.follow(userId)
    } catch {
      // Reverte em caso de erro
      followingIds.value = new Set([...followingIds.value].filter(id => id !== userId))
    } finally {
      pendingIds.value = new Set([...pendingIds.value].filter(id => id !== userId))
    }
  }

  async function unfollow(userId) {
    if (pendingIds.value.has(userId)) return

    pendingIds.value = new Set([...pendingIds.value, userId])
    followingIds.value = new Set([...followingIds.value].filter(id => id !== userId))

    try {
      await followsService.unfollow(userId)
    } catch {
      // Reverte em caso de erro
      followingIds.value = new Set([...followingIds.value, userId])
    } finally {
      pendingIds.value = new Set([...pendingIds.value].filter(id => id !== userId))
    }
  }

  // Hidrata os IDs de seguidos ao carregar o perfil
  function setFollowingIds(ids = []) {
    followingIds.value = new Set(ids)
  }

  return {
    followingIds,
    pendingIds,
    isFollowing,
    isPending,
    follow,
    unfollow,
    setFollowingIds,
  }
})
