export function useRelativeTime(dateInput) {
  if (!dateInput) return ''
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const diffMs = Date.now() - date.getTime()
  if (diffMs < 0) return 'agora'
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours   = Math.floor(minutes / 60)
  const days    = Math.floor(hours / 24)
  const weeks   = Math.floor(days / 7)
  const months  = Math.floor(days / 30)
  const years   = Math.floor(days / 365)
  if (seconds < 60)  return 'agora'
  if (minutes < 60)  return `há ${minutes}m`
  if (hours   < 24)  return `há ${hours}h`
  if (days    < 7)   return `há ${days}d`
  if (weeks   < 5)   return `há ${weeks}s`
  if (months  < 12)  return `há ${months}me`
  return `há ${years}a`
}
