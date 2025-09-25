<script setup lang="ts">
import ParkFilter from '@/components/common/ParkFilter.vue'
import ShowsBoard from '@/components/shows/ShowsBoard.vue'
</script>

<template>
  <ParkFilter />
  <ShowsBoard :show-all-next-shows="true" :showOnlyFavorites="false" />
</template>
