<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters'
import useLiveData from '@/hooks/useLiveData'
import { DISNEYLAND_PARK_ID, DISNEY_STUDIOS_ID } from '@/utils/constants'
import ParkFilter from '@/components/ParkFilter.vue'
import UserPreferences from '@/components/UserPreferences.vue'
import AttractionsBoard from '@/components/AttractionsBoard.vue'
import ShowsBoard from '@/components/ShowsBoard.vue'
import {
  disneylandParkRadient,
  disneylandStudiosRadient,
  allParksRadient,
} from '@/styles/homeView.styles'

const filterStore = useFiltersStore()
const { error, refetch } = useLiveData()
</script>

<template>
  <div v-if="error" class="flex justify-center">
    <div class="text-red-700 p-6 mt-6 text-center bg-slate-50 rounded-xl">
      <p>{{ error }}</p>
      <button @click="refetch()" class="py-2 px-4 rounded-xl bg-slate-500 text-white mt-2">
        Retry
      </button>
    </div>
  </div>
  <main
    v-else
    :class="{
      [disneylandParkRadient]: filterStore.parkIdFilter === DISNEYLAND_PARK_ID,
      [disneylandStudiosRadient]: filterStore.parkIdFilter === DISNEY_STUDIOS_ID,
      [allParksRadient]: filterStore.parkIdFilter === 'ALL',
    }"
  >
    <h1 class="sr-only">Waitopia</h1>
    <div class="p-2">
      <ParkFilter />
      <UserPreferences />
      <ShowsBoard v-if="filterStore.showNextShows" />
      <AttractionsBoard />
    </div>
  </main>
</template>
