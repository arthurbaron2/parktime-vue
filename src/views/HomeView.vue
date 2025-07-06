<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useHiddenList } from '@/stores/hiddenList'
import type {
  Destination,
  LiveData,
  AttractionLiveData,
  ShowLiveData,
} from '@/types/themeParkTypes'
import { useFiltersStore } from '@/stores/filters'
import AttractionEntity from '@/components/attractionEntity.vue'

const DISNEYLAND_PARK_ID = 'dae968d5-630d-4719-8b06-3d107e944401'
const DISNEYLAND_RESORT_ID = 'e8d0207f-da8a-4048-bec8-117aa946b2c2'
const DISNEY_STUDIOS_ID = 'ca888437-ebb4-4d50-aed2-d227f7096968'

const { hiddenList } = useHiddenList()

const filterStore = useFiltersStore()

const { data, dataUpdatedAt } = useQuery<Destination>({
  queryKey: ['liveData'],
  queryFn: async () => {
    const response = await fetch(
      `https://api.themeparks.wiki/v1/entity/${DISNEYLAND_RESORT_ID}/live`,
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  },
})

const lastUpdateTime = computed(() => {
  if (!dataUpdatedAt) return

  return new Date(dataUpdatedAt.value).toLocaleTimeString('fr-FR', {
    timeStyle: 'short',
  })
})

const filterByEntityType = (item: LiveData) => item.entityType === filterStore.entityTypeFilter

const filterByPark = (item: LiveData) => {
  if (filterStore.parkIdFilter === 'ALL') return true
  return item.parkId === filterStore.parkIdFilter
}

const filterByStatus = (item: LiveData) =>
  filterStore.showClosed ? true : ['OPERATING', 'DOWN'].includes(item.status)

const filterByHidden = (item: LiveData) =>
  filterStore.showHidden ? true : !hiddenList.includes(item.id)

const filteredData = computed(() => {
  if (!data.value) return []

  const filteredValues = data.value.liveData
    .filter(filterByPark)
    .filter(filterByEntityType)
    .filter(filterByHidden)
    .filter(filterByStatus)

  if (filterStore.entityTypeFilter === 'SHOW') {
    return filteredValues as ShowLiveData[]
  }

  const sortedValues = (filteredValues as AttractionLiveData[]).sort(
    (a: AttractionLiveData, b: AttractionLiveData) => {
      const aWaitTime = a.queue?.STANDBY?.waitTime || 0
      const bWaitTime = b.queue?.STANDBY?.waitTime || 0
      const aSingleRiderWaitTime = a.queue?.SINGLE_RIDER?.waitTime || aWaitTime
      const bSingleRiderWaitTime = b.queue?.SINGLE_RIDER?.waitTime || bWaitTime
      const aStatus = a.status
      const bStatus = b.status

      if (aStatus === 'CLOSED' && bStatus !== 'CLOSED') return 1
      if (bStatus === 'CLOSED' && aStatus !== 'CLOSED') return -1
      if (aStatus === 'DOWN' && bStatus !== 'DOWN') return 1
      if (bStatus === 'DOWN' && aStatus !== 'DOWN') return -1

      if (filterStore.sortBy === 'TIME_DOWN') {
        return aWaitTime - bWaitTime
      }
      if (filterStore.sortBy === 'TIME_UP') {
        return bWaitTime - aWaitTime
      }
      if (filterStore.sortBy === 'TIME_DOWN_SINGLE_RIDER') {
        return aSingleRiderWaitTime - bSingleRiderWaitTime
      }
      if (filterStore.sortBy === 'TIME_UP_SINGLE_RIDER') {
        return bSingleRiderWaitTime - aSingleRiderWaitTime
      }
      return 0
    },
  )
  return sortedValues
})

const buttonClass = 'w-1/2 p-2 text-sm rounded-md bg-slate-400 text-white'
</script>

<template>
  <main>
    <h1 class="text-center font-bold text-lg p-2">Disneyland Paris Live Data</h1>
    <nav class="p-2">
      <div class="flex gap-2">
        <button @click="filterStore.updateParkIdFilter(DISNEYLAND_PARK_ID)" :class="buttonClass">
          Disneyland Park
        </button>
        <button @click="filterStore.updateParkIdFilter(DISNEY_STUDIOS_ID)" :class="buttonClass">
          Walt Disney Studios
        </button>
        <button @click="filterStore.updateParkIdFilter('ALL')" :class="buttonClass">All</button>
      </div>

      <div class="pt-2">
        <label>
          <input
            type="checkbox"
            v-bind:checked="filterStore.showHidden"
            @click="filterStore.toggleShowHidden()"
          />
          Show hidden
        </label>
        <label>
          <input
            type="checkbox"
            v-bind:checked="filterStore.showClosed"
            @click="filterStore.toggleShowClosed()"
          />
          Show closed
        </label>
      </div>
    </nav>
    <div class="rounded-t-lg px-2 pb-4 bg-slate-700">
      <nav class="flex items-center justify-between">
        <button @click="filterStore.updateSort" class="text-blue-300 text-left">
          <span class="text-white text-sm block">Sort by</span>
          <span
            >{{ filterStore.sortBy.includes('SINGLE_RIDER') ? 'single rider' : '' }} waiting
            time</span
          >
          <v-icon
            name="fa-long-arrow-alt-up"
            :class="{
              'rotate-45':
                filterStore.sortBy === 'TIME_DOWN' ||
                filterStore.sortBy === 'TIME_DOWN_SINGLE_RIDER',
              'rotate-135':
                filterStore.sortBy === 'TIME_UP' || filterStore.sortBy === 'TIME_UP_SINGLE_RIDER',
            }"
          />
        </button>
        <p class="text-right py-2 text-sm">
          Last update<span class="block text-base">{{ lastUpdateTime }}</span>
        </p>
      </nav>
      <ul class="flex gap-0.5 flex-col">
        <li v-for="(data, index) in filteredData" :key="data.id">
          <AttractionEntity
            v-if="data.entityType === 'ATTRACTION'"
            :liveData="data"
            :index
            :nb-entities="filteredData.length"
          />

          <span v-if="data.entityType === 'SHOW'">
            {{ data.name }} -
            <span v-for="showtime in data.showtimes" :key="showtime.startTime">
              {{
                new Date(showtime.startTime).toLocaleTimeString('fr-FR', {
                  timeStyle: 'short',
                })
              }}
              -
            </span>
          </span>
        </li>
      </ul>
    </div>
  </main>
</template>
