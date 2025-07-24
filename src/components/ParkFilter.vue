<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters'
import { DISNEYLAND_PARK_ID, DISNEY_STUDIOS_ID } from '@/utils/constants'
import { buttonClass } from '@/styles/homeView.styles'

const filterStore = useFiltersStore()
</script>

<template>
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
</template>
