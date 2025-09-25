<script setup lang="ts">
import ParkFilter from '@/components/common/ParkFilter.vue'
import AttractionsBoard from '@/components/attractions/AttractionsBoard.vue'
</script>

<template>
  <ParkFilter />
  <AttractionsBoard :show-only-favorites="false" />
</template>
