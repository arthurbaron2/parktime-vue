<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters'
import ParkFilter from '@/components/ParkFilter.vue'
import AttractionsBoard from '@/components/AttractionsBoard.vue'
import ShowsBoard from '@/components/ShowsBoard.vue'

const filterStore = useFiltersStore()
</script>

<template>
  <ParkFilter />
  <ShowsBoard v-if="filterStore.showNextShows" :show-only-favorites="true" />
  <AttractionsBoard />
</template>
