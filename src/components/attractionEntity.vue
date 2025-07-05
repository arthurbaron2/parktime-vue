<script setup lang="ts">
import type { AttractionLiveData } from '@/types/themeParkTypes'

const props = defineProps<{ liveData: AttractionLiveData }>()

console.log(props.liveData)
</script>

<template>
  <div>
    Wait Time: {{ liveData.queue.STANDBY.waitTime }} min
    <span v-if="liveData.queue.SINGLE_RIDER?.waitTime">
      - Single Rider: {{ liveData.queue.SINGLE_RIDER.waitTime }} min
    </span>

    - {{ liveData.name }}
  </div>
</template>
