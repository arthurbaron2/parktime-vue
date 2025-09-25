import type { AttractionLiveData, LiveData } from '@/types/themeParksAPI.types'
import { sortAttractions } from '@/utils/filters'
import { computed } from 'vue'
import { useFavorites } from '@/stores/favorites'
import { useFiltersStore } from '@/stores/filters'
import useLiveData from './useLiveData'
import { getChildParksFromResort } from '@/utils/park'
import useCurrentPark from './useCurrentPark'

const removedAttractions: string[] = [
  'c2e37859-cd32-4a34-9d6f-43d32d744b4e',
  '78b5e028-1574-4ea5-9ac1-8d5356400044',
  '76e9e917-fe07-49d5-b604-f65d831210fa',
  'ced66356-4eca-482d-86ef-958e4a7dc87f',
]

const useFilteredAttractions = () => {
  const filterStore = useFiltersStore()
  const favoritesStore = useFavorites()
  const park = useCurrentPark()
  const { data } = useLiveData()

  const filterByEntityType = (item: LiveData) => item.entityType === 'ATTRACTION'
  const filterByStatus = (item: LiveData) =>
    filterStore.showClosed ? true : ['OPERATING', 'DOWN'].includes(item.status)
  const filterByFavorites = (item: LiveData) => favoritesStore.favorites.includes(item.id)
  const filterByRemovedAttractions = (item: LiveData) => !removedAttractions.includes(item.id)

  const sortedAttractions = computed<{
    attractions: AttractionLiveData[]
    favorites: AttractionLiveData[]
  }>(() => {
    const filterByPark = (item: LiveData) => {
      if (!park.value?.parkId) return true
      const parks = getChildParksFromResort(park.value.parkId)
      return parks.some((park) => park.parkId === item.parkId)
    }

    if (!data.value) {
      return { attractions: [], favorites: [] }
    }

    const filteredValues = data.value.liveData
      .filter(filterByEntityType)
      .filter(filterByPark)
      .filter(filterByRemovedAttractions)
      .filter(filterByStatus)

    const attractions = sortAttractions(filteredValues, filterStore.sortBy)
    const favorites = attractions.filter(filterByFavorites)
    const noFavorites = attractions.filter(
      (attraction) => !favorites.find((f) => f.id === attraction.id),
    )

    return { attractions: noFavorites, favorites }
  })

  return sortedAttractions
}

export default useFilteredAttractions
