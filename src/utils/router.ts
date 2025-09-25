import { PARKS } from '@/utils/constants'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

export function isValidParkId(parkId: string): boolean {
  return PARKS.some((park) => park.id === parkId)
}

export function validateParkRoute(to: RouteLocationNormalizedGeneric) {
  const parkId = to.params.id as string
  if (!isValidParkId(parkId)) {
    return { name: 'park-selector' }
  }
}
