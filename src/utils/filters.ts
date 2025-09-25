import type { AttractionLiveData } from '@/types/themeParksAPI.types'
import { type SortBy } from '@/stores/filters'

export const sortAttractions = (filteredValues: AttractionLiveData[], sortBy: SortBy) =>
  filteredValues.sort((a: AttractionLiveData, b: AttractionLiveData) => {
    const aWaitTime = a.queue?.STANDBY?.waitTime || 0
    const bWaitTime = b.queue?.STANDBY?.waitTime || 0
    const aSingleRiderWaitTime = a.queue?.SINGLE_RIDER?.waitTime || aWaitTime
    const bSingleRiderWaitTime = b.queue?.SINGLE_RIDER?.waitTime || bWaitTime
    const aStatus = a.status
    const bStatus = b.status

    if (aStatus === 'CLOSED' && bStatus !== 'CLOSED') return 1
    if (bStatus === 'CLOSED' && aStatus !== 'CLOSED') return -1
    if (aStatus === 'DOWN' && bStatus !== 'DOWN') return 1
    if (bStatus === 'DOWN' && aStatus !== 'DOWN') return -1

    if (sortBy === 'TIME_DOWN') {
      return aWaitTime - bWaitTime
    }
    if (sortBy === 'TIME_UP') {
      return bWaitTime - aWaitTime
    }
    if (sortBy === 'TIME_DOWN_SINGLE_RIDER') {
      return aSingleRiderWaitTime - bSingleRiderWaitTime
    }
    if (sortBy === 'TIME_UP_SINGLE_RIDER') {
      return bSingleRiderWaitTime - aSingleRiderWaitTime
    }
    return 0
  })
