import type { EntityType } from '@/types/themeParkTypes'
import { defineStore } from 'pinia'

export type SortBy = 'TIME_DOWN' | 'TIME_UP' | 'TIME_DOWN_SINGLE_RIDER' | 'TIME_UP_SINGLE_RIDER'

const LOCAL_STORAGE_KEY = 'dream-park-filters'

export interface Filters {
  parkIdFilter: string | 'ALL'
  entityTypeFilter: EntityType
  sortBy: SortBy
  showFavorites: boolean
  showClosed: boolean
  showNextShows: boolean
  showtimeDiff: number
  showClosingSoon: boolean
  showClosingSoonDiff: number
}

const defaultFilters: Filters = {
  parkIdFilter: 'ALL',
  entityTypeFilter: 'ATTRACTION',
  sortBy: 'TIME_DOWN',
  showFavorites: false,
  showClosed: false,
  showNextShows: true,
  showtimeDiff: 120,
  showClosingSoon: false,
  showClosingSoonDiff: 60,
}

const getStoredFilters = (): Filters => {
  const storedFilters = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (storedFilters) {
    return {
      ...defaultFilters,
      ...JSON.parse(storedFilters),
    }
  }
  return defaultFilters
}

const saveInLocalStorage = (filters: Filters) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters))
}

export const useFiltersStore = defineStore('filters', {
  state: (): Filters => getStoredFilters(),
  actions: {
    updateSort() {
      if (this.sortBy === 'TIME_DOWN') {
        this.sortBy = 'TIME_UP'
      } else if (this.sortBy === 'TIME_UP') {
        this.sortBy = 'TIME_DOWN_SINGLE_RIDER'
      } else if (this.sortBy === 'TIME_DOWN_SINGLE_RIDER') {
        this.sortBy = 'TIME_UP_SINGLE_RIDER'
      } else {
        this.sortBy = 'TIME_DOWN'
      }
      saveInLocalStorage(this.$state)
    },
    updateSettings(settings: Filters) {
      this.$state = {
        ...this.$state,
        ...settings,
      }
      saveInLocalStorage(this.$state)
    },
    updateParkIdFilter(parkId: string) {
      this.parkIdFilter = parkId
      saveInLocalStorage(this.$state)
    },
  },
})
