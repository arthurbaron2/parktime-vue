import { PARKS } from '@/utils/constants'
import type { Park } from '@/types/park.types'

export const getParkLabel = (parkId: string) => {
  const park = getParkFromId(parkId)
  if (park) return park.parkName
  return 'Unknown Park'
}

export const getParkFromId = (id: string | string[]): Park | undefined => {
  if (Array.isArray(id)) return undefined

  if (id.length === 36) {
    return PARKS.find((park) => park.parkId === id)
  }
  return PARKS.find((park) => park.id === id)
}

/**
 * Get all parks related to a resort, based on park id. It will find and return the resort itself and all its child parks.
 * @param parkId - The park id or resort id
 * @returns All parks related to the resort
 */
export const getAllParksFromResort = (parkId: string | string[] | undefined): Park[] => {
  if (!parkId) return []
  const park = getParkFromId(parkId)
  if (!park) return []
  const parentPark = getParentParkFromId(parkId)
  if (!parentPark) return []
  return getChildParksFromResort(parentPark.parkId)
}

export const getChildParksFromResort = (resortId?: string | string[]): Park[] => {
  if (!resortId) return []

  const resort = getParkFromId(resortId)

  if (!resort) return []

  const parksIds: string[] = [...(resort?.childParksIds || []), resort.parkId]
  return parksIds.map((parkId) => getParkFromId(parkId)).filter((park) => park !== undefined)
}

export const getParentParkFromId = (id: string | string[]): Park | undefined => {
  if (Array.isArray(id)) return undefined

  const park = getParkFromId(id)

  if (!park) return undefined

  if (!park.parentParkId) return park

  return getParkFromId(park.parentParkId)
}

export const getResorts = (): Park[] => {
  return PARKS.filter((park) => park.showInResortSelection)
}
