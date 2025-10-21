<script setup lang="ts">
import useAttraction from '@/hooks/useAttraction'
import AttractionLiveData from './AttractionLiveData.vue'
import AttractionInformations from './AttractionInformations.vue'
import AttractionStatistics from './AttractionStatistics.vue'
import AttractionUptime from './AttractionUptime.vue'

const props = defineProps<{ attractionId: string }>()
const attraction = useAttraction({ attractionId: props.attractionId })
</script>

<template>
  <div v-if="attraction" class="text-slate-900 pb-8">
    <h2 class="text-xl font-bold text-center">{{ attraction.name }}</h2>
    <AttractionLiveData :attraction="attraction" />
    <AttractionInformations :attraction="attraction" />
    <AttractionStatistics :attraction="attraction" />
    <AttractionUptime :attraction="attraction" />
  </div>
  <div v-else></div>
</template>
