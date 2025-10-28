import { onMounted, ref } from 'vue'
import type { DayAttractionWaitTimes, Destination } from '@/types/parktimeapi.types'
import useLiveData from './useLiveData'

interface UseAttractionDayWaitTimesProps {
  attractionId: string
}

const useAttractionDayWaitTimes = ({ attractionId }: UseAttractionDayWaitTimesProps) => {
  const attractionWaitTimes = ref<DayAttractionWaitTimes | null>(null)
  const { data: liveData } = useLiveData()

  const fetchAttractionWaitTimes = async () => {
    if (!attractionId) {
      throw new Error('Attraction ID is required')
    }

    const timezone = (liveData.value as Destination).timezone
    const today = new Date().toLocaleDateString('fr-CA', { timeZone: timezone })

    const response = await fetch(
      `https://api.parktime.fr/attraction/${attractionId}/wait-times/${today}`,
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  onMounted(async () => {
    attractionWaitTimes.value = await fetchAttractionWaitTimes()
  })

  return attractionWaitTimes
}

export default useAttractionDayWaitTimes
