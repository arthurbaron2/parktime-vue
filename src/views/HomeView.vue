<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const DISNEYLAND_PARK_ID = 'dae968d5-630d-4719-8b06-3d107e944401'
const DISNEYLAND_RESORT_ID = 'e8d0207f-da8a-4048-bec8-117aa946b2c2'
const DISNEY_STUDIOS_ID = 'ca888437-ebb4-4d50-aed2-d227f7096968'

type EntityType = 'DESTINATION' | 'PARK' | 'ATTRACTION' | 'SHOW'

type Status = 'OPERATING' | 'DOWN' | 'CLOSED' | 'REFURBISHMENT'

interface Destination {
  id: string
  name: string
  entityType: EntityType
  timezone: string
  liveData: LiveData[]
}

type LiveData = ShowLiveData | AttractionLiveData

interface ShowLiveData {
  id: string
  name: string
  entityType: 'SHOW'
  parkId: string
  externalId: string
  showtimes: {
    type: string
    endTime: string
    startTime: string
  }[]
  status: Status
  lastUpdated: string
}

interface AttractionLiveData {
  id: string
  name: string
  entityType: 'ATTRACTION'
  parkId: string
  externalId: string
  queue: {
    STANDBY: {
      waitTime: number
    }
    SINGLE_RIDER: {
      waitTime: number
    }
  }
  status: Status
  lastUpdated: string
}

const { data, isPending, isError, error, dataUpdatedAt } = useQuery<Destination>({
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

const filterType = ref<EntityType>('ATTRACTION')
const filterPark = ref<string>('ALL')
const lastUpdateTime = computed(() => {
  if (!dataUpdatedAt) return

  return new Date(dataUpdatedAt.value).toLocaleTimeString('fr-FR', {
    timeStyle: 'short',
  })
})

const filterByType = (item: LiveData) => item.entityType === filterType.value

const filterByPark = (item: LiveData) => {
  if (filterPark.value === 'ALL') return true
  return item.parkId === filterPark.value
}

const filteredData = computed(() => {
  if (!data.value) return []

  return data.value.liveData.filter(filterByPark).filter(filterByType)
})
</script>

<template>
  <main>
    <h1>Disneyland Live Data</h1>
    <p>Last update : {{ lastUpdateTime }}</p>
    <div>
      <h2>Filters</h2>
      <div>
        By park :
        <button @click="filterPark = DISNEYLAND_PARK_ID">Disneyland Park</button>
        <button @click="filterPark = DISNEY_STUDIOS_ID">Disney Studios</button>
        <button @click="filterPark = 'ALL'">All Parks</button>
      </div>
      <div>
        By type : <button @click="filterType = 'ATTRACTION'">Attractions</button>
        <button @click="filterType = 'SHOW'">Shows</button>
      </div>
    </div>

    <span v-if="isPending">Loading...</span>
    <span v-else-if="isError && error">Error: {{ error.message }}</span>
    <div v-for="data in filteredData" :key="data.id">
      {{ data.name }}
      <span v-if="data.entityType === 'ATTRACTION'">
        - Wait Time: {{ data.queue.STANDBY.waitTime }} min
        <span v-if="data.queue.SINGLE_RIDER">
          - Single Rider: {{ data.queue.SINGLE_RIDER.waitTime }} min
        </span>
      </span>

      <span v-if="data.entityType === 'SHOW'">
        <span v-for="showtime in data.showtimes" :key="showtime.startTime">
          -
          {{
            new Date(showtime.startTime).toLocaleTimeString('fr-FR', {
              timeStyle: 'short',
            })
          }}
        </span>
      </span>
    </div>
  </main>
</template>
