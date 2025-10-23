export const getDiffInMinutes = (start?: Date, end?: Date): number => {
  if (!start || !end) return -1

  const diffInMs = end.getTime() - start.getTime()
  return Math.floor(diffInMs / (1000 * 60))
}

export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000) // in seconds
  if (diff < 5) return 'just now'
  if (diff < 60) return `${diff} second${diff === 1 ? '' : 's'} ago`
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export const formatHoursFromMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes} minutes`
  }

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`
}

export const formatTimeToFrench = (date: Date): string => {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
