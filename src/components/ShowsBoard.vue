<script setup lang="ts">
import useLoader from '@/hooks/useLoader'
import useFilteredShows from '@/hooks/useFilteredShows'
import ShowEntity from '@/components/ShowEntity.vue'
import ShowSkeleton from '@/components/ShowSkeleton.vue'
import { useFiltersStore } from '@/stores/filters'
import { computed } from 'vue'

const { loaderVisible } = useLoader()

const filteredShows = useFilteredShows()
const filterStore = useFiltersStore()

const showtimeDiff = computed(() => {
  return filterStore.showtimeDiff / 60
})
</script>

<template>
  <div class="rounded-xl px-2 pb-4 bg-slate-700/50 text-white mb-4">
    <h2 class="text-md font-bold py-4 text-center">Shows in next {{ showtimeDiff }} hours</h2>
    <ul class="flex gap-2 flex-col">
      <div v-if="loaderVisible">
        <ShowSkeleton :count="2" />
      </div>
      <li v-else v-for="show in filteredShows.nextShows" :key="show.id">
        <ShowEntity :show="show" />
      </li>
    </ul>
  </div>
</template>
