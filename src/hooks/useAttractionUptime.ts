import type { Destination, Uptime } from '@/types/parktimeapi.types'
import { onMounted, ref } from 'vue'
import useLiveData from './useLiveData'

interface UseAttractionUptimeProps {
  attractionId: string
}

const useAttractionUptime = ({ attractionId }: UseAttractionUptimeProps) => {
  const attractionUptime = ref<Uptime | null>(null)
  const { data: liveData } = useLiveData()

  const fetchAttractionUptime = async () => {
    if (!attractionId) {
      throw new Error('Attraction ID is required')
    }
    const timezone = (liveData.value as Destination).timezone
    const today = new Date().toLocaleDateString('fr-CA', { timeZone: timezone })
    const response = await fetch(
      `https://api.parktime.fr/attraction/${attractionId}/uptime/${today}`,
    )
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
