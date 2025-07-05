import type { EntityType } from '@/types/themeParkTypes'
import { defineStore } from 'pinia'

type SortBy = 'TIME_DOWN' | 'TIME_UP' | 'TIME_DOWN_SINGLE_RIDER' | 'TIME_UP_SINGLE_RIDER'

const LOCAL_STORAGE_KEY = 'dream-park-filters'

interface Filters {
  parkIdFilter: string | 'ALL'
  entityTypeFilter: EntityType
  sortBy: SortBy
  showHidden: boolean
  showClosed: boolean
}

const getStoredFilters = (): Filters => {
  const storedFilters = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (storedFilters) {
    return JSON.parse(storedFilters)
  }
  return {
    parkIdFilter: 'ALL',
    entityTypeFilter: 'ATTRACTION',
    sortBy: 'TIME_DOWN',
    showHidden: false,
    showClosed: false,
  }
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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state))
    },
    updateParkIdFilter(parkId: string) {
      this.parkIdFilter = parkId
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state))
    },
    updateEntityTypeFilter(type: EntityType) {
      this.entityTypeFilter = type
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state))
    },
    toggleShowHidden() {
      this.showHidden = !this.showHidden
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state))
    },
    toggleShowClosed() {
      this.showClosed = !this.showClosed
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state))
    },
  },
})
