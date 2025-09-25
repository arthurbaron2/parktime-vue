<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters'
import useLiveData from '@/hooks/useLiveData'
import useLoader from '@/hooks/useLoader'
import AttractionsList from '@/components/attractions/AttractionsList.vue'

const filterStore = useFiltersStore()
const { refetch } = useLiveData()
const { lastUpdateTime } = useLoader()

defineProps<{
  showOnlyFavorites?: boolean
}>()
</script>

<template>
  <div class="rounded-xl px-2 pb-4 bg-slate-700/50 text-white">
    <h2 v-if="showOnlyFavorites" class="text-md font-bold pt-4 text-center">
      Favorites rides waiting times
    </h2>
    <h2 v-else class="text-md font-bold pt-4 text-center">Rides waiting times</h2>
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
                filterStore.sortBy === 'TIME_UP' || filterStore.sortBy === 'TIME_UP_SINGLE_RIDER',
            }"
          />
        </span>
      </button>
      <button @click="refetch()" class="text-right py-2 text-sm">
        Last update<span class="block text-base">{{ lastUpdateTime || '...' }}</span>
      </button>
    </nav>
    <AttractionsList :show-only-favorites="showOnlyFavorites" />
    <div class="text-center text-xs text-slate-100 mt-4">
      <a href="https://themeparks.wiki/api" rel="noopenner noreferrer" target="_blank">
        Powered by ThemeParks.wiki API
      </a>
    </div>
  </div>
</template>
