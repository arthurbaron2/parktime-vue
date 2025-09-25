<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters'
import useFilteredAttractions from '@/hooks/useFilteredAttractions'
import useLoader from '@/hooks/useLoader'
import { computed } from 'vue'
import AttractionSkeleton from '@/components/attractions/AttractionSkeleton.vue'
import AttractionEntity from '@/components/attractions/AttractionEntity.vue'

const props = defineProps<{
  showOnlyFavorites?: boolean
}>()

const filterStore = useFiltersStore()
const sortedAttractions = useFilteredAttractions()
const haveFavorites = computed(() => sortedAttractions.value.favorites.length > 0)
const { loaderVisible } = useLoader()

const haveAttractions = computed(
  () =>
    sortedAttractions.value.attractions.length > 0 &&
    !filterStore.showFavorites &&
    !props.showOnlyFavorites,
)
</script>

<template>
  <div v-if="loaderVisible">
    <AttractionSkeleton :count="10" />
  </div>
  <div v-else>
    <ul v-if="haveFavorites" class="flex gap-2 flex-col">
      <li v-for="data in sortedAttractions.favorites" :key="data.id">
        <AttractionEntity :liveData="data" />
      </li>
    </ul>
    <span v-if="haveFavorites && haveAttractions" class="flex items-center justify-center">
      <span class="h-2 bg-slate-100/90 rounded-full w-10 my-4" />
    </span>
    <ul v-if="haveAttractions" class="flex gap-2 flex-col">
      <li v-for="data in sortedAttractions.attractions" :key="data.id">
        <AttractionEntity :liveData="data" />
      </li>
    </ul>
  </div>
</template>
