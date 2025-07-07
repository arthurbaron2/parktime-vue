import { computed } from 'vue'
import { defineStore } from 'pinia'
import useSchedule from '@/hooks/useSchedule'
import { DISNEY_STUDIOS_ID, DISNEYLAND_PARK_ID } from '@/utils/constants'
import type { ResortSchedule, Schedule } from '@/types/themeParkTypes'

type ResortOpeningSchedule = Record<string, OpeningSchedule>

interface OpeningSchedule {
  openingTime: Date
  closingTime: Date
}

const getParkOpeningSchedule = (parkId: string, schedule: ResortSchedule): Schedule | undefined => {
  return schedule.parks
    .find((park) => park.id === parkId)
    ?.schedule.find(
      (schedule) =>
        schedule.date === new Date().toISOString().split('T')[0] && schedule.type === 'OPERATING',
    )
}

export const useOpeningSchedule = defineStore('schedule', () => {
  const { data } = useSchedule()

  const formatedSchedule = computed<ResortOpeningSchedule | undefined>(() => {
    if (!data.value) return

    const disneylandOpening = getParkOpeningSchedule(DISNEYLAND_PARK_ID, data.value)
    const disneyStudiosOpening = getParkOpeningSchedule(DISNEY_STUDIOS_ID, data.value)

    if (!disneylandOpening || !disneyStudiosOpening) return

    return {
      [DISNEYLAND_PARK_ID]: {
        openingTime: new Date(disneylandOpening.openingTime),
        closingTime: new Date(disneylandOpening.closingTime),
      },
      [DISNEY_STUDIOS_ID]: {
        openingTime: new Date(disneyStudiosOpening.openingTime),
        closingTime: new Date(disneyStudiosOpening.closingTime),
      },
    }
  })

  return { schedule: formatedSchedule }
})
