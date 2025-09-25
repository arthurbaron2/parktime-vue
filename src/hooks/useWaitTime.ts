import { computed } from 'vue'
import type { AttractionLiveData } from '@/types/themeParksAPI.types'
import { getTimerColor } from '@/utils/attraction'
import { useFiltersStore } from '@/stores/filters'

const useWaitTime = ({ liveData }: { liveData: AttractionLiveData }) => {
  const filters = useFiltersStore()
  const standbyWaitTime = liveData.queue.STANDBY?.waitTime
  const singleRiderWaitTime = liveData.queue.SINGLE_RIDER?.waitTime
  const status = computed(() => liveData.status)

  const mainWaitTime = computed(() => {
    if (filters.sortBy.includes('SINGLE_RIDER')) {
      return singleRiderWaitTime || standbyWaitTime
    }
    return standbyWaitTime
  })

  const backupWaitTime = computed(() => {
    if (filters.sortBy.includes('SINGLE_RIDER') && singleRiderWaitTime) {
      return standbyWaitTime
    }
    return singleRiderWaitTime
  })

  const mainWaitTimeClass = computed(() => getTimerColor(status.value, mainWaitTime.value))
  const backupWaitTimeClass = computed(() => getTimerColor(status.value, backupWaitTime.value))

  return {
    mainWaitTime,
    mainWaitTimeClass,
    backupWaitTime,
    backupWaitTimeClass,
  }
}

export default useWaitTime
