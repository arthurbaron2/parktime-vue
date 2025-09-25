import type { Status } from '@/types/themeParksAPI.types'

export const getTimerColor = (status: Status, waitTime?: number) => {
  if (waitTime === undefined || status !== 'OPERATING' || waitTime < 0)
    return 'bg-slate-100 text-slate-800'

  if (waitTime >= 45) return 'bg-rose-400 text-rose-950 '
  if (waitTime >= 25) return 'bg-amber-400 text-amber-950'
  return 'bg-green-400 text-green-950'
}
