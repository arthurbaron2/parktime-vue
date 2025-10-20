import useLiveData from '@/hooks/useLiveData'
import { useFiltersStore } from '@/stores/filters'
import { useFavorites } from '@/stores/favorites'
import type { LiveData, ShowLiveData } from '@/types/parktimeapi.types'
import { computed } from 'vue'
import { getDiffInMinutes } from '@/utils/date'
import { getChildParksFromResort } from '@/utils/park'
import useCurrentPark from './useCurrentPark'

const removedShows: string[] = ['4e9e9271-1962-4fad-9f73-9370954018cf']

const useFilteredShows = ({ showAllNextShows = false }: { showAllNextShows?: boolean } = {}) => {
  const { data } = useLiveData()
  const filterStore = useFiltersStore()
  const favoritesStore = useFavorites()
  const park = useCurrentPark()
  const filterByEntityType = (item: LiveData) => item.entityType === 'SHOW'
  const filterByPark = (item: LiveData) => {
    if (!park.value?.parkId) return true
    const parks = getChildParksFromResort(park.value.parkId)
    return parks.some((park) => park.parkId === item.parkId)
  }

  const filterByRemovedShows = (item: ShowLiveData) => !removedShows.includes(item.id)

  const filterByFavorites = (item: ShowLiveData) => favoritesStore.favorites.includes(item.id)

  const filterByNextHours = (item: ShowLiveData) => {
    if (!item.showtimes || item.showtimes.length === 0) return false

    const now = new Date()

    return item.showtimes.some((showtime) => {
      const start = new Date(showtime.startTime)
      const diff = getDiffInMinutes(now, start)
      return diff >= 0 && (showAllNextShows ? true : diff <= filterStore.showtimeDiff)
    })
  }

  const filteredShows = computed<{ nextShows: ShowLiveData[]; favorites: ShowLiveData[] }>(() => {
    if (!data.value) return { nextShows: [], favorites: [] }

    const allShows = data.value.liveData
      .filter(filterByEntityType)
      .filter(filterByPark)
      .filter(filterByRemovedShows)
      .filter(filterByNextHours)

    const favorites = allShows.filter(filterByFavorites)
    const noFavorites = allShows.filter((show) => !favorites.find((f) => f.id === show.id))

    return { nextShows: noFavorites, favorites }
  })

  return filteredShows
}

export default useFilteredShows
