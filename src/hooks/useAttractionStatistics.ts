import type { AttractionStatistics } from '@/types/parktimeapi.types'

import { onMounted, ref } from 'vue'

interface UseAttractionStatisticsProps {
  attractionId: string
}

const useAttractionStatistics = ({ attractionId }: UseAttractionStatisticsProps) => {
  const attractionStatistics = ref<AttractionStatistics | null>(null)

  const fetchAttractionStatistics = async () => {
    if (!attractionId) {
      throw new Error('Attraction ID is required')
    }
    const response = await fetch(`https://parktime.fr/api/attraction/${attractionId}/statistics`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  onMounted(async () => {
    attractionStatistics.value = await fetchAttractionStatistics()
  })

  return attractionStatistics
}

export default useAttractionStatistics
