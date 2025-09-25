import type { Destination } from '@/types/themeParksAPI.types'
import { useQuery } from '@tanstack/vue-query'
import { computed, watch } from 'vue'
import useCurrentPark from './useCurrentPark'
import { getParentParkFromId } from '@/utils/park'

const useLiveData = () => {
  const currentPark = useCurrentPark()
  const parkToFetch = computed(() =>
    currentPark.value ? getParentParkFromId(currentPark.value.parkId) : undefined,
  )

  const query = useQuery<Destination>({
    queryKey: ['liveData', parkToFetch.value?.parkId],
    queryFn: async () => {
      if (!parkToFetch.value?.parkId) {
        throw new Error('Park ID not available')
      }
      const response = await fetch(
        `https://api.themeparks.wiki/v1/entity/${parkToFetch.value.parkId}/live`,
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      console.trace('FETCHING LIVE DATA FOR PARK', parkToFetch.value.parkId)
      return response.json()
    },
    enabled: computed(() => !!parkToFetch.value?.parkId),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 2,
  })

  watch(parkToFetch, (oldId, newId) => {
    if (!oldId || !newId) return
    query.refetch()
  })

  return query
}

export default useLiveData
