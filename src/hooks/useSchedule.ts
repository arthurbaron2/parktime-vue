import type { ResortSchedule } from '@/types/parktimeapi.types'
import { DISNEYLAND_RESORT_ID } from '@/utils/constants'
import { useQuery } from '@tanstack/vue-query'

const useSchedule = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  const query = useQuery<ResortSchedule>({
    queryKey: ['resortSchedule'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.themeparks.wiki/v1/entity/${DISNEYLAND_RESORT_ID}/schedule/${year}/${month}`,
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })

  return query
}

export default useSchedule
