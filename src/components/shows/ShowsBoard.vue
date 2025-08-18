<script setup lang="ts">
import useLoader from '@/hooks/useLoader'
import useFilteredShows from '@/hooks/useFilteredShows'
import ShowEntity from '@/components/shows/ShowEntity.vue'
import ShowSkeleton from '@/components/shows/ShowSkeleton.vue'
import { useFiltersStore } from '@/stores/filters'
import { formatHoursFromMinutes } from '@/utils/date'
import { computed } from 'vue'

const props = defineProps<{
  showOnlyFavorites?: boolean
  showAllNextShows?: boolean
}>()

const { loaderVisible } = useLoader()

const filteredShows = useFilteredShows({ showAllNextShows: props.showAllNextShows })
const filterStore = useFiltersStore()

const showtimeDiff = computed(() => {
  return formatHoursFromMinutes(filterStore.showtimeDiff)
})

const haveFavorites = computed(() => filteredShows.value.favorites.length > 0)

const haveShows = computed(
  () =>
    filteredShows.value.nextShows.length > 0 &&
    !filterStore.showFavorites &&
    !props.showOnlyFavorites,
)

const isEmpty = computed(() => props.showOnlyFavorites && !haveFavorites.value && !haveShows.value)
</script>

<template>
  <div v-if="!isEmpty" class="rounded-xl px-2 pb-4 bg-slate-700/50 text-white mb-4">
    <div v-if="haveShows || haveFavorites">
      <h2 v-if="showAllNextShows" class="text-md font-bold py-4 text-center">All next shows</h2>
      <h2 v-else-if="showOnlyFavorites" class="text-md font-bold py-4 text-center">
        Favorites shows in next {{ showtimeDiff }}
      </h2>
      <h2 v-else class="text-md font-bold py-4 text-center">Shows in next {{ showtimeDiff }}</h2>
      <div v-if="loaderVisible">
        <ShowSkeleton :count="2" />
      </div>
      <div v-else>
        <ul v-if="haveFavorites" class="flex gap-2 flex-col">
          <li v-for="show in filteredShows.favorites" :key="show.id">
            <ShowEntity :show="show" :show-all-next-shows="showAllNextShows" />
          </li>
        </ul>
        <span v-if="haveFavorites && haveShows" class="flex items-center justify-center">
          <span class="h-2 bg-slate-100/90 rounded-full w-10 my-4" />
        </span>
        <ul v-if="haveShows" class="flex gap-2 flex-col">
          <li v-for="show in filteredShows.nextShows" :key="show.id">
            <ShowEntity :show="show" :show-all-next-shows="showAllNextShows" />
          </li>
        </ul>
      </div>
    </div>
    <p v-else class="text-center pt-4 text-white font-bold">
      There is no shows in the next {{ showtimeDiff }}
    </p>
  </div>
</template>
