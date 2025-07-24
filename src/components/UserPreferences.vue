<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters'
import { useFavorites } from '@/stores/favorites'

const filterStore = useFiltersStore()
const favoritesStore = useFavorites()
</script>

<template>
  <div class="py-4 flex gap-2 flex-col">
    <label>
      <input
        name="show-closed"
        type="checkbox"
        :checked="filterStore.showClosed"
        @click="filterStore.toggleShowClosed()"
      />
      Show closed
    </label>
    <label v-if="favoritesStore.favorites.length > 0">
      <input
        name="show-favorites"
        type="checkbox"
        :checked="filterStore.showFavorites"
        @click="filterStore.toggleShowFavorites()"
      />
      Show only favorites
    </label>
    <label>
      <input
        name="show-next-shows"
        type="checkbox"
        :checked="filterStore.showNextShows"
        @click="filterStore.toggleShowNextShows()"
      />
      Show next shows
    </label>
    <label>
      Show next shows in
      <select
        name="showtime-diff"
        v-model="filterStore.showtimeDiff"
        @change="filterStore.updateShowtimeDiff(Number($event.target?.value ?? 0))"
      >
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
        <option value="45">45 minutes</option>
        <option value="60">1 hour</option>
        <option value="90">1 hour 30</option>
        <option value="120">2 hours</option>
        <option value="180">3 hours</option>
        <option value="240">4 hours</option>
      </select>
    </label>
  </div>
</template>
