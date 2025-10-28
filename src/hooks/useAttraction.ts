import type { Attraction } from '@/types/parktimeapi.types'

import { onMounted, ref } from 'vue'

interface UseAttractionProps {
  attractionId: string
}

const useAttraction = ({ attractionId }: UseAttractionProps) => {
  const attraction = ref<Attraction | null>(null)

  const fetchAttraction = async () => {
    if (!attractionId) {
      throw new Error('Attraction ID is required')
    }
    const response = await fetch(`https://api.parktime.fr/attraction/${attractionId}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  onMounted(async () => {
    attraction.value = await fetchAttraction()
  })

  return attraction
}

export default useAttraction
