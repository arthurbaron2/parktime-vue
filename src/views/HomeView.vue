<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useFavorites } from '@/stores/favorites'
import type { LiveData, AttractionLiveData } from '@/types/themeParkTypes'
import { useFiltersStore } from '@/stores/filters'
import AttractionEntity from '@/components/attractionEntity.vue'
import useLiveData from '@/hooks/useLiveData'
import { DISNEYLAND_PARK_ID, DISNEY_STUDIOS_ID } from '@/utils/constants'
import { formatRelativeTime } from '@/utils/date'
import { cva } from 'class-variance-authority'

const sortAttractions = (filteredValues: AttractionLiveData[]) =>
  filteredValues.sort((a: AttractionLiveData, b: AttractionLiveData) => {
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
  })

const filterStore = useFiltersStore()
const favoritesStore = useFavorites()

const { data, dataUpdatedAt, error, refetch, isLoading, isFetching } = useLiveData()

const loaderVisible = ref(false)
let loaderTimeout: ReturnType<typeof setTimeout> | null = null

watch(
  [isLoading, isFetching],
  ([loading, fetching]) => {
    if (loading || fetching) {
      loaderVisible.value = true
      if (loaderTimeout) clearTimeout(loaderTimeout)
    } else {
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

const filterByFavorites = (item: LiveData) => favoritesStore.favorites.includes(item.id)

const sortedAttractions = computed<{
  attractions: AttractionLiveData[]
  favorites: AttractionLiveData[]
}>(() => {
  if (!data.value) return { attractions: [], favorites: [] }

  const filteredValues = data.value.liveData
    .filter(filterByEntityType)
    .filter(filterByPark)
    .filter(filterByStatus)

  const attractions = sortAttractions(filteredValues)
  const favorites = attractions.filter(filterByFavorites)
  const noFavorites = attractions.filter(
    (attraction) => !favorites.find((f) => f.id === attraction.id),
  )

  return { attractions: noFavorites, favorites }
})

const haveFavorites = computed(() => sortedAttractions.value.favorites.length > 0)

const buttonClass = cva(
  'flex-1 p-4 text-sm rounded-xl text-white shadow-slate-900/50 transition-all duration-100 text-shadow-sm text-shadow-slate-900/50',
  {
    variants: {
      active: {
        true: 'animation-none ring-2 ring-slate-300',
        false: '',
      },
      park: {
        [DISNEYLAND_PARK_ID]: '',
        [DISNEY_STUDIOS_ID]: '',
        ALL: '',
      },
    },
    compoundVariants: [
      {
        active: false,
        park: DISNEYLAND_PARK_ID,
        class: 'background-animate-park',
      },
      {
        active: false,
        park: DISNEY_STUDIOS_ID,
        class: 'background-animate-studios',
      },
      {
        active: false,
        park: 'ALL',
        class: 'background-animate-all-parks',
      },
    ],
  },
)
</script>

<template>
  <main
    :class="{
      'background-animate-park': filterStore.parkIdFilter === DISNEYLAND_PARK_ID,
      'background-animate-studios': filterStore.parkIdFilter === DISNEY_STUDIOS_ID,
      'background-animate-all-parks': filterStore.parkIdFilter === 'ALL',
    }"
  >
    <h1 class="sr-only">Waitopia</h1>
    <p v-if="error" class="text-red-500 text-center">Error: {{ error }}</p>
    <div v-else class="p-2">
      <div class="flex gap-2 pt-4">
        <button
          @click="filterStore.updateParkIdFilter(DISNEYLAND_PARK_ID)"
          :class="
            buttonClass({
              active: filterStore.parkIdFilter === DISNEYLAND_PARK_ID,
              park: DISNEYLAND_PARK_ID,
            })
          "
        >
          Disneyland Park
        </button>
        <button
          @click="filterStore.updateParkIdFilter(DISNEY_STUDIOS_ID)"
          :class="
            buttonClass({
              active: filterStore.parkIdFilter === DISNEY_STUDIOS_ID,
              park: DISNEY_STUDIOS_ID,
            })
          "
        >
          Walt Disney Studios
        </button>
        <button
          @click="filterStore.updateParkIdFilter('ALL')"
          :class="
            buttonClass({
              active: filterStore.parkIdFilter === 'ALL',
              park: 'ALL',
            })
          "
        >
          All parks
        </button>
      </div>

      <div class="py-4 flex gap-2 flex-col">
        <label>
          <input
            name="show-closed"
            type="checkbox"
            :checked="filterStore.showClosed"
            @click="filterStore.toggleShowClosed()"
          />
          Show closed
        </label>
        <label v-if="favoritesStore.favorites.length > 0">
          <input
            name="show-favorites"
            type="checkbox"
            :checked="filterStore.showFavorites"
            @click="filterStore.toggleShowFavorites()"
          />
          Show only favorites
        </label>
      </div>
      <div class="rounded-xl px-2 pb-4 bg-slate-700/50 text-white">
        <nav class="flex items-center justify-between py-2">
          <button @click="filterStore.updateSort" class="text-left">
            <span class="text-sm block">Sort by</span>
            <span class="text-sky-300">
              {{ filterStore.sortBy.includes('SINGLE_RIDER') ? 'single rider' : '' }} waiting time
              <v-icon
                name="fa-long-arrow-alt-up"
                :class="{
                  'rotate-45':
                    filterStore.sortBy === 'TIME_DOWN' ||
                    filterStore.sortBy === 'TIME_DOWN_SINGLE_RIDER',
                  'rotate-135':
                    filterStore.sortBy === 'TIME_UP' ||
                    filterStore.sortBy === 'TIME_UP_SINGLE_RIDER',
                }"
              />
            </span>
          </button>
          <button @click="refetch()" class="text-right py-2 text-sm">
            Last update<span class="block text-base">{{ lastUpdateTime || '...' }}</span>
          </button>
        </nav>
        <div v-if="loaderVisible" class="flex gap-2 flex-col">
          <div
            v-for="i in 10"
            :key="i"
            class="flex rounded-xl animate-pulse w-full bg-slate-300/30 shadow-slate-700/50 px-3 py-2 relative items-center min-h-15 shadow-md"
          >
            <span class="size-10 rounded-full bg-slate-100/50" />
            <span class="flex-1 h-4 bg-slate-100/50 rounded-full ml-3" />
            <span class="size-10 rounded-xl ml-3 bg-slate-100/50" />
          </div>
        </div>
        <div v-else>
          <ul v-if="haveFavorites" class="flex gap-2 flex-col">
            <li v-for="data in sortedAttractions.favorites" :key="data.id">
              <AttractionEntity :liveData="data" />
            </li>
          </ul>
          <span v-if="haveFavorites" class="flex items-center justify-center">
            <span class="h-2 bg-slate-100/90 rounded-full w-10 my-4" />
          </span>
          <ul class="flex gap-2 flex-col">
            <li v-for="data in sortedAttractions.attractions" :key="data.id">
              <AttractionEntity :liveData="data" />
            </li>
          </ul>
        </div>

        <div class="text-center text-xs text-slate-100 mt-4">
          <a href="https://themeparks.wiki/api" rel="noopenner noreferrer" target="_blank">
            Powered by ThemeParks.wiki API
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.background-animate-studios {
  background:
    linear-gradient(0deg, rgba(217, 14, 18, 0.3), rgba(217, 14, 18, 0) 30%),
    linear-gradient(
      100deg,
      rgba(6, 5, 123, 1) 10%,
      rgba(44, 156, 236, 1) 40%,
      rgba(44, 156, 236, 1) 60%,
      rgba(6, 5, 123, 1) 90%
    );
  background-size: 1000%;

  -webkit-animation: StudioBackgroundAnimation 15s ease-in-out infinite;
  -moz-animation: StudioBackgroundAnimation 15s ease-in-out infinite;
  animation: StudioBackgroundAnimation 15s ease-in-out infinite;
}

@keyframes StudioBackgroundAnimation {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.background-animate-park {
  background:
    linear-gradient(45deg, rgba(255, 20, 147, 0.8), rgba(255, 20, 147, 0) 70.71%),
    linear-gradient(135deg, rgba(30, 144, 255, 0.9), rgba(30, 144, 255, 0) 70.71%),
    linear-gradient(225deg, rgba(220, 20, 60, 0.7), rgba(220, 20, 60, 0) 70.71%),
    linear-gradient(315deg, rgba(255, 105, 180, 0.6), rgba(255, 105, 180, 0) 70.71%);
  background-size: 100% 300%;
  background-position: 0% 100%;

  -webkit-animation: ParkBackgroundAnimation 15s ease-in-out infinite;
  -moz-animation: ParkBackgroundAnimation 15s ease-in-out infinite;
  animation: ParkBackgroundAnimation 15s ease-in-out infinite;
}

@keyframes ParkBackgroundAnimation {
  0%,
  100% {
    background-position: 0% 100%;
  }
  50% {
    background-position: 0% 0%;
  }
}

.background-animate-all-parks {
  background:
    linear-gradient(60deg, rgba(6, 5, 123, 1), rgba(6, 5, 123, 0) 70.71%),
    linear-gradient(30deg, rgba(222, 166, 11, 0.7), rgba(166, 141, 72, 0) 80%),
    linear-gradient(320deg, rgba(255, 105, 180, 0.8), rgba(255, 105, 180, 0) 70.71%);
  background-size: 100% 300%;

  -webkit-animation: AllParksBackgroundAnimation 13s linear 2s infinite;
  -moz-animation: AllParksBackgroundAnimation 13s linear 2s infinite;
  animation: AllParksBackgroundAnimation 13s linear 2s infinite;
}

@keyframes AllParksBackgroundAnimation {
  0%,
  100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 0% 100%;
  }
}
</style>
