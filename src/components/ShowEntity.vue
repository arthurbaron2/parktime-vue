<script setup lang="ts">
import type { ShowLiveData } from '@/types/themeParkTypes'
import { getDiffInMinutes } from '@/utils/date'
import { computed } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import ShowDate from '@/components/ShowDate.vue'
import { getParkLabel } from '@/utils/park'
import { DISNEYLAND_PARK_ID, DISNEY_STUDIOS_ID } from '@/utils/constants'
import {
  disneylandParkRadient,
  disneylandStudiosRadient,
  allParksRadient,
} from '@/styles/homeView.styles'

const props = defineProps<{
  show: ShowLiveData
}>()

const filterStore = useFiltersStore()

const showtimes = computed(() => {
  const now = new Date()
  return props.show.showtimes
    .filter((showtime) => {
      const start = new Date(showtime.startTime)
      const diff = getDiffInMinutes(now, start)
      return diff >= 0 && diff <= filterStore.showtimeDiff
    })
    .map((showtime) => showtime.startTime)
})

const hasShowtimesAfterFilter = computed(() => {
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
      <p
        v-if="filterStore.parkIdFilter === 'ALL'"
        class="text-xs text-slate-100 text-shadow-md text-shadow-slate-900/20 shadow-slate-900/20 shadow-md rounded-full whitespace-nowrap ml-2 px-2 py-1"
        :class="{
          [disneylandParkRadient]: show.parkId === DISNEYLAND_PARK_ID,
          [disneylandStudiosRadient]: show.parkId === DISNEY_STUDIOS_ID,
          [allParksRadient]: show.parkId === 'ALL',
        }"
      >
        {{ getParkLabel(show.parkId) }}
      </p>
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
