<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useFavorites } from '@/stores/favorites'
import type { LiveData, AttractionLiveData } from '@/types/themeParkTypes'
import { useFiltersStore } from '@/stores/filters'
import AttractionEntity from '@/components/attractionEntity.vue'
import useLiveData from '@/hooks/useLiveData'
import { DISNEYLAND_PARK_ID, DISNEY_STUDIOS_ID } from '@/utils/constants'
import { formatRelativeTime } from '@/utils/date'

const favoritesStore = useFavorites()
const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // @ts-expect-error: standalone is only present on iOS Safari
  window.navigator.standalone === true ||
  document.referrer.includes('android-app://')

const filterStore = useFiltersStore()

const { data, dataUpdatedAt, error, refetch, isLoading, isFetching } = useLiveData()

const displayMode = isInStandaloneMode() ? 'standalone' : 'browser'

// Loader d'au moins 1s
const loaderVisible = ref(false)
let loaderTimeout: ReturnType<typeof setTimeout> | null = null

watch(
  [isLoading, isFetching],
  ([loading, fetching]) => {
    if (loading || fetching) {
      loaderVisible.value = true
      if (loaderTimeout) clearTimeout(loaderTimeout)
    } else {
      // Affiche le loader au moins 1s
      if (loaderTimeout) clearTimeout(loaderTimeout)
      loaderTimeout = setTimeout(() => {
        loaderVisible.value = false
      }, 200)
    }
  },
  { immediate: true },
)

const now = ref(new Date())

onMounted(() => {
  const interval = setInterval(() => {
    now.value = new Date()
  }, 1000)
  onUnmounted(() => clearInterval(interval))
})

const lastUpdateTime = computed(() => {
  void now.value // force la dépendance réactive
  if (!dataUpdatedAt?.value) return ''
  return formatRelativeTime(new Date(dataUpdatedAt.value))
})

const filterByEntityType = (item: LiveData) => item.entityType === 'ATTRACTION'

const filterByPark = (item: LiveData) => {
  if (filterStore.parkIdFilter === 'ALL') return true
  return item.parkId === filterStore.parkIdFilter
}

const filterByStatus = (item: LiveData) =>
  filterStore.showClosed ? true : ['OPERATING', 'DOWN'].includes(item.status)

const filterByFavorites = (item: LiveData) =>
  filterStore.showFavorites ? favoritesStore.favorites.includes(item.id) : true

const filteredData = computed(() => {
  if (!data.value) return []

  const filteredValues = data.value.liveData
    .filter(filterByEntityType)
    .filter(filterByPark)
    .filter(filterByFavorites)
    .filter(filterByStatus)

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
    <h1 class="text-center font-bold text-lg p-2">Waitopia {{ displayMode }}</h1>
    <p v-if="error" class="text-red-500 text-center">Error: {{ error }}</p>
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
            v-bind:checked="filterStore.showClosed"
            @click="filterStore.toggleShowClosed()"
          />
          Show closed
        </label>
        <label v-if="favoritesStore.favorites.length > 0">
          <input
            type="checkbox"
            v-bind:checked="filterStore.showFavorites"
            @click="filterStore.toggleShowFavorites()"
          />
          Show only favorites
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
        <button @click="refetch()" class="text-right py-2 text-sm">
          Last update<span class="block text-base">{{ lastUpdateTime || '...' }}</span>
        </button>
      </nav>
      <div v-if="loaderVisible" class="flex gap-0.5 flex-col">
        <div
          v-for="[i, index] in Array.from({ length: 10 }, (_, i) => [i, i])"
          :key="i"
          class="flex animate-pulse w-full bg-slate-600 px-3 py-2 relative items-center min-h-15 shadow-md"
          :class="{
            'rounded-t-md': index === 0,
            'rounded-b-md': index === 9,
          }"
        >
          <span class="size-10 rounded-full bg-slate-500" />
          <span class="flex-1 h-4 bg-slate-500 rounded-full ml-3" />
          <span class="size-10 rounded-lg ml-3 bg-slate-500" />
        </div>
      </div>
      <ul v-else class="flex gap-0.5 flex-col">
        <li v-for="(data, index) in filteredData" :key="data.id">
          <AttractionEntity
            v-if="data.entityType === 'ATTRACTION'"
            :liveData="data"
            :index
            :nb-entities="filteredData.length"
          />
        </li>
      </ul>
      <div class="text-center text-sm text-slate-400 mt-4">
        <a href="https://themeparks.wiki/api" rel="noopenner noreferrer" target="_blank">
          Powered by ThemeParks.wiki API
        </a>
      </div>
    </div>
  </main>
</template>
