const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

const MESES_CURTOS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

function toDate(input) {
  if (!input) return null
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input
  const d = new Date(input)
  return isNaN(d.getTime()) ? null : d
}

export function useRelativeDisplay(dateInput) {
  const date = toDate(dateInput)
  if (!date) return ''

  const diffMs  = Date.now() - date.getTime()
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
  if (weeks   < 5)   return `há ${weeks} semana${weeks > 1 ? 's' : ''}`
  if (months  < 12)  return `há ${months} mês${months > 1 ? 'es' : ''}`
  return `há ${years} ano${years > 1 ? 's' : ''}`
}

export function useShortDate(dateInput) {
  const date = toDate(dateInput)
  if (!date) return ''

  const day   = date.getDate()
  const month = MESES[date.getMonth()]
  const year  = date.getFullYear()

  if (year === new Date().getFullYear()) {
    return `${day} de ${month}`
  }
  return `${day} de ${month} de ${year}`
}

export function useFullDateTime(dateInput) {
  const date = toDate(dateInput)
  if (!date) return ''

  const day    = date.getDate().toString().padStart(2, '0')
  const month  = MESES_CURTOS[date.getMonth()]
  const year   = date.getFullYear()
  const hour   = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')

  return `${day} ${month} ${year} às ${hour}:${minute}`
}

export function useTimeOnly(dateInput) {
  const date = toDate(dateInput)
  if (!date) return ''

  const hour   = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${hour}:${minute}`
}

export function useImageTime(dateInput) {
  const date = toDate(dateInput)
  if (!date) return ''

  const diffMs  = Date.now() - date.getTime()
  const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (days < 7) return useRelativeDisplay(dateInput)
  return useShortDate(dateInput)
}
