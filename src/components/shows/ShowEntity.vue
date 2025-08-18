<script setup lang="ts">
import type { ShowLiveData } from '@/types/themeParkTypes'
import { getDiffInMinutes } from '@/utils/date'
import { computed } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import ShowDate from '@/components/shows/ShowDate.vue'
import { useFavorites } from '@/stores/favorites'

const props = defineProps<{
  show: ShowLiveData
  showAllNextShows?: boolean
}>()

const filterStore = useFiltersStore()
const favoritesStore = useFavorites()
const isFavorite = computed(() => favoritesStore.favorites.includes(props.show.id))

const showtimes = computed(() => {
  const now = new Date()
  return props.show.showtimes
    .filter((showtime) => {
      const start = new Date(showtime.startTime)
      const diff = getDiffInMinutes(now, start)
      return diff >= 0 && (props.showAllNextShows ? true : diff <= filterStore.showtimeDiff)
    })
    .map((showtime) => showtime.startTime)
})

const hasShowtimesAfterFilter = computed(() => {
  if (props.showAllNextShows) return false
  const now = new Date()
  return props.show.showtimes.some((showtime) => {
    const start = new Date(showtime.startTime)
    return getDiffInMinutes(now, start) > filterStore.showtimeDiff
  })
})
</script>

<template>
  <div
    class="flex flex-col gap-2 bg-slate-300/30 shadow-slate-700/50 px-3 py-2 relative rounded-xl"
  >
    <div class="flex items-center">
      <h2 class="font-bold w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
        {{ show.name }}
      </h2>
      <div class="ml-3">
        <button
          @click="favoritesStore.toggleFavorite(show.id)"
          aria-label="Ajouter aux favoris"
          class="rounded-xl bg-slate-200 size-10 flex items-center justify-center active:bg-slate-100 transition-colors duration-300"
          :class="{ 'text-red-400': isFavorite, 'text-slate-600': !isFavorite }"
        >
          <v-icon name="fa-heart" />
        </button>
      </div>
    </div>
    <div class="flex items-center overflow-scroll rounded-md">
      <ul class="flex gap-2">
        <li v-for="startTime in showtimes" :key="startTime">
          <ShowDate :showtime="startTime" />
        </li>
      </ul>
      <p
        v-if="hasShowtimesAfterFilter"
        aria-label="there is more showtimes after the filter"
        class="flex size-8 min-w-8 bg-slate-200 text-slate-700 items-center justify-center rounded-md ml-2"
      >
        <v-icon name="fa-long-arrow-alt-up" class="rotate-90" />
      </p>
    </div>
  </div>
</template>
