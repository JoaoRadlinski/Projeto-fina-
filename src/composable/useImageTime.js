/**
 * useImageTime.js
 *
 * Utilitário de formatação de datas/horas para exibição em posts e imagens.
 * Complementa o useRelativeTime (tempo relativo), oferecendo também
 * formatos absolutos (ex: "12 de abril", "12 abr 2024 às 14:30").
 */

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

const MESES_CURTOS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

/**
 * Converte qualquer entrada de data em um objeto Date.
 * Aceita string ISO, timestamp (number) ou Date.
 * Retorna null se inválido.
 */
function toDate(input) {
  if (!input) return null
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input
  const d = new Date(input)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Retorna tempo relativo legível (igual ao useRelativeTime, para compatibilidade).
 * Ex: "agora", "há 5m", "há 2h", "há 3d"
 */
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

/**
 * Retorna data no formato "12 de abril" (ano omitido se for o ano atual).
 * Se for de outro ano: "12 de abril de 2023".
 */
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

/**
 * Retorna data e hora completas: "12 abr 2024 às 14:30".
 * Útil para tooltips e acessibilidade (aria-label).
 */
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

/**
 * Retorna apenas o horário: "14:30".
 */
export function useTimeOnly(dateInput) {
  const date = toDate(dateInput)
  if (!date) return ''

  const hour   = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${hour}:${minute}`
}

/**
 * Escolhe automaticamente o melhor formato com base na proximidade da data.
 * - Menos de 1 hora:  "agora" / "há Xm"
 * - Menos de 24h:     "há Xh"
 * - Menos de 7 dias:  "há Xd"
 * - Menos de 1 ano:   "12 de abril"
 * - Mais de 1 ano:    "12 de abril de 2023"
 */
export function useImageTime(dateInput) {
  const date = toDate(dateInput)
  if (!date) return ''

  const diffMs  = Date.now() - date.getTime()
  const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (days < 7) return useRelativeDisplay(dateInput)
  return useShortDate(dateInput)
}
