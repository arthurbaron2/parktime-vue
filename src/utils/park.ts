import { DISNEYLAND_PARK_ID, DISNEYLAND_RESORT_ID, DISNEY_STUDIOS_ID } from '@/utils/constants'

export const getParkLabel = (parkId: string) => {
  if (parkId === DISNEYLAND_PARK_ID) return 'Disneyland Paris'
  if (parkId === DISNEYLAND_RESORT_ID) return 'Disneyland Resort'
  if (parkId === DISNEY_STUDIOS_ID) return 'Walt Disney Studios'
  return 'Unknown Park'
}
