import type { Destination } from '@/types/themeParkTypes'
import { DISNEYLAND_RESORT_ID } from '@/utils/constants'
import { useQuery } from '@tanstack/vue-query'

const useLiveData = () => {
  const query = useQuery<Destination>({
    queryKey: ['liveData'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.themeparks.wiki/v1/entity/${DISNEYLAND_RESORT_ID}/live`,
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 2,
  })

  return query
}

export default useLiveData
