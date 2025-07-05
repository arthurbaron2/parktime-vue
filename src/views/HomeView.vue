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

const { hiddenList, addToHiddenList } = useHiddenList()

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
</script>

<template>
  <main class="bg-slate-800 min-h-screen p-2 text-white">
    <h1>Disneyland Live Data</h1>
    <p>Last update : {{ lastUpdateTime }}</p>
    <div>
      <h2>Filters</h2>
      <div>
        By park :
        <button @click="filterStore.updateParkIdFilter(DISNEYLAND_PARK_ID)">Disneyland Park</button>
        <button @click="filterStore.updateParkIdFilter(DISNEY_STUDIOS_ID)">Disney Studios</button>
        <button @click="filterStore.updateParkIdFilter('ALL')">All Parks</button>
      </div>
      <div>
        By type :
        <button @click="filterStore.updateEntityTypeFilter('ATTRACTION')">Attractions</button>
        <button @click="filterStore.updateEntityTypeFilter('SHOW')">Shows</button>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            v-bind:checked="filterStore.showHidden"
            @click="filterStore.toggleShowHidden"
          />
          Show hidden
        </label>
        <label>
          <input
            type="checkbox"
            v-bind:checked="filterStore.showClosed"
            @click="filterStore.toggleShowClosed"
          />
          Show closed
        </label>
      </div>
      <div>
        Sort by <button @click="filterStore.updateSort">{{ filterStore.sortBy }}</button>
      </div>
    </div>
    <ul class="rounded-md overflow-hidden flex gap-0.5 flex-col">
      <li v-for="data in filteredData" :key="data.id" class="p-2 bg-slate-600">
        <AttractionEntity v-if="data.entityType === 'ATTRACTION'" :liveData="data" />

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
        <button @click="addToHiddenList(data.id)">Hide</button>
      </li>
    </ul>
  </main>
</template>
