import type { Uptime } from '@/types/parktimeapi.types'

import { onMounted, ref } from 'vue'

interface UseAttractionUptimeProps {
  attractionId: string
}

const useAttractionUptime = ({ attractionId }: UseAttractionUptimeProps) => {
  const attractionUptime = ref<Uptime | null>(null)

  const fetchAttractionUptime = async () => {
    if (!attractionId) {
      throw new Error('Attraction ID is required')
    }
    const response = await fetch(`https://parktime.fr/api/attraction/${attractionId}/uptime`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  onMounted(async () => {
    attractionUptime.value = await fetchAttractionUptime()
  })

  return attractionUptime
}

export default useAttractionUptime
