<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters'
import ParkFilter from '@/components/ParkFilter.vue'
import AttractionsBoard from '@/components/attractions/AttractionsBoard.vue'
import ShowsBoard from '@/components/shows/ShowsBoard.vue'
import ScheduleBanner from '@/components/ScheduleBanner.vue'

const filterStore = useFiltersStore()
</script>

<template>
  <ParkFilter />
  <ScheduleBanner />
  <ShowsBoard v-if="filterStore.showNextShows" :show-only-favorites="true" />
  <AttractionsBoard />
</template>
