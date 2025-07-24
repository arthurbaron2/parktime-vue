import useLiveData from '@/hooks/useLiveData'
import { useFiltersStore } from '@/stores/filters'
import type { LiveData, ShowLiveData } from '@/types/themeParkTypes'
import { computed } from 'vue'
import { getDiffInMinutes } from '@/utils/date'

const removedShows: string[] = ['4e9e9271-1962-4fad-9f73-9370954018cf']

const useFilteredShows = () => {
  const { data } = useLiveData()
  const filterStore = useFiltersStore()

  const filterByEntityType = (item: LiveData) => item.entityType === 'SHOW'
  const filterByPark = (item: LiveData) => {
    if (filterStore.parkIdFilter === 'ALL') return true
    return item.parkId === filterStore.parkIdFilter
  }

  const filterByRemovedShows = (item: ShowLiveData) => !removedShows.includes(item.id)

  const filterByNextTwoHours = (item: ShowLiveData) => {
    if (!item.showtimes || item.showtimes.length === 0) return false
    const now = new Date()
    return item.showtimes.some((showtime) => {
      const start = new Date(showtime.startTime)
      const diff = getDiffInMinutes(now, start)
      return diff >= 0 && diff <= filterStore.showtimeDiff
    })
  }

  const filteredShows = computed<{ nextShows: ShowLiveData[] }>(() => {
    if (!data.value) return { nextShows: [] }

    return {
      nextShows: data.value.liveData
        .filter(filterByEntityType)
        .filter(filterByPark)
        .filter(filterByRemovedShows)
        .filter(filterByNextTwoHours),
    }
  })

  return filteredShows
}

export default useFilteredShows
