import { computed } from 'vue'
import { defineStore } from 'pinia'
import useSchedule from '@/hooks/useSchedule'
import { DISNEY_STUDIOS_ID, DISNEYLAND_PARK_ID } from '@/utils/constants'
import type { ResortSchedule, Schedule } from '@/types/themeParksAPI.types'
import { getDiffInMinutes } from '@/utils/date'
import { getParkLabel } from '@/utils/park'
import { useFiltersStore } from './filters'

type ResortOpeningSchedule = OpeningSchedule[]

interface OpeningSchedule {
  parkId: string
  parkName: string
  openingTime: Date
  closingTime: Date
  closeSoon: boolean
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
  const filterStore = useFiltersStore()

  const formatedSchedule = computed<ResortOpeningSchedule | undefined>(() => {
    if (!data.value) return

    const disneylandOpening = getParkOpeningSchedule(DISNEYLAND_PARK_ID, data.value)
    const disneyStudiosOpening = getParkOpeningSchedule(DISNEY_STUDIOS_ID, data.value)

    if (!disneylandOpening || !disneyStudiosOpening) return

    const now = new Date()

    const disneylandClose = getDiffInMinutes(now, new Date(disneylandOpening.closingTime))
    const disneyStudiosClose = getDiffInMinutes(now, new Date(disneyStudiosOpening.closingTime))

    return [
      {
        parkId: DISNEYLAND_PARK_ID,
        parkName: getParkLabel(DISNEYLAND_PARK_ID),
        openingTime: new Date(disneylandOpening.openingTime),
        closingTime: new Date(disneylandOpening.closingTime),
        closeSoon: disneylandClose <= filterStore.showClosingSoonDiff && disneylandClose > 0,
      },
      {
        parkId: DISNEY_STUDIOS_ID,
        parkName: getParkLabel(DISNEY_STUDIOS_ID),
        openingTime: new Date(disneyStudiosOpening.openingTime),
        closingTime: new Date(disneyStudiosOpening.closingTime),
        closeSoon: disneyStudiosClose <= filterStore.showClosingSoonDiff && disneyStudiosClose > 0,
      },
    ]
  })

  return { schedule: formatedSchedule }
})
