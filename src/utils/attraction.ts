import type { Status, Uptime } from '@/types/parktimeapi.types'
import { interests } from './constants'
import type { TooltipItem } from 'chart.js'

export const getTimerColor = (status: Status, waitTime: number | null) => {
  if (waitTime === null || status !== 'OPERATING' || waitTime < 0)
    return 'bg-slate-100 text-slate-800'

  if (waitTime >= 45) return 'bg-rose-400 text-rose-950 '
  if (waitTime >= 25) return 'bg-amber-400 text-amber-950'
  return 'bg-green-400 text-green-950'
}

export const getInterest = (interest: string) => {
  switch (interest) {
    case 'roller_coaster':
      return interests.roller_coaster
    case 'extreme_rides':
      return interests.extreme_rides
    case 'water_ride':
      return interests.water_ride
    case 'dark_ride':
      return interests.dark_ride
    case 'family_ride':
      return interests.family_ride
    case 'flat_ride':
      return interests.flat_ride
    case 'kiddie_ride':
      return interests.kiddie_ride
    case 'spin_ride':
      return interests.spin_ride
    case 'single_rider':
      return interests.single_rider
    case 'water_splash':
      return interests.water_splash
    case 'playground':
      return interests.playground
    case 'walking_ride':
      return interests.walking_ride
    case 'transport_ride':
      return interests.transport_ride
    case 'themed_experience':
      return interests.themed_experience
    default:
      return { name: 'UNKNOWN', color: 'bg-gray-500/20 text-gray-950' }
  }
}

export const getUptimeLabel = (
  { label, parsed }: TooltipItem<'doughnut'>,
  uptimeData: Uptime | null,
) => {
  if (!uptimeData) {
    return `${label}: ${parsed.toFixed(1)}%`
  }

  const totalMinutes = label === 'Operating' ? uptimeData.operatingTime : uptimeData.downTime
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)

  const timeDisplay = hours > 0 ? `${hours}h${minutes > 0 ? `${minutes}min` : ''}` : `${minutes}min`

  return `${label}: ${parsed.toFixed(1)}% (${timeDisplay})`
}
