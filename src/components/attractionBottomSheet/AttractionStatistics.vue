<script setup lang="ts">
import useAttractionStatistics from '@/hooks/useAttractionStatistics'
import type { Attraction } from '@/types/parktimeapi.types'

const props = defineProps<{ attraction: Attraction }>()

const attractionStatistics = useAttractionStatistics({ attractionId: props.attraction.id })
</script>

<template>
  <div v-if="attractionStatistics" class="my-4 bg-slate-500/10 rounded-xl py-2 px-4 text-sm">
    <h3 class="text-md font-bold text-center my-4">Waiting times for today</h3>
  </div>

  <div v-else>LOADING STATISTICS...</div>
</template>
