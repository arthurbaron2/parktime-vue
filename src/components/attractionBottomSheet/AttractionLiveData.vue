<script setup lang="ts">
import type { Status, Attraction } from '@/types/parktimeapi.types'
import { cx } from 'class-variance-authority'
import { computed } from 'vue'

const props = defineProps<{ attraction: Attraction }>()

const statusList: Record<Status, string> = {
  OPERATING: 'Operating',
  DOWN: 'Paused',
  CLOSED: 'Closed',
  REFURBISHMENT: 'Refurbishment',
}

const liveData = computed(() => props.attraction.liveData)
const statusName = computed(() => statusList[liveData.value.status])
const status = computed(() => liveData.value.status)
</script>

<template>
  <div class="flex items-center justify-center my-4">
    <span
      class="text-xs px-2 py-1 rounded-full"
      :class="
        cx({
          'bg-green-500/40 text-green-950': status === 'OPERATING',
          'bg-amber-500/40 text-amber-950': status === 'DOWN' || status === 'REFURBISHMENT',
          'bg-red-500/40 text-red-950': status === 'CLOSED',
        })
      "
    >
      {{ statusName }}
    </span>
  </div>
  <div class="bg-slate-500/10 rounded-xl py-8 my-4 px-2 flex">
    <p class="flex-1 flex flex-col items-center justify-center border-r border-slate-500/20">
      <v-icon name="fa-clock" class="size-6" aria-label="Standby wait time" />
      <span class="text-md pt-3" v-if="liveData.standbyWait !== null">
        {{ liveData.standbyWait }} mn
      </span>
      <span class="text-md pt-3" v-else>...</span>
    </p>
    <p
      v-if="liveData.singleRiderWait"
      class="flex-1 flex flex-col items-center justify-center border-r border-slate-500/20"
    >
      <v-icon name="fa-user-clock" class="size-6" aria-label="Single rider wait time" />
      <span class="text-md pt-3">{{ liveData.singleRiderWait }} mn</span>
    </p>
    <p class="flex-1 flex flex-col items-center justify-center">
      <span class="relative size-6" aria-label="Height restriction">
        <v-icon name="fa-arrows-alt-v" class="size-6 -left-2 absolute" />
        <v-icon name="fa-child" class="size-6 -right-1.5 absolute" />
      </span>
      <span v-if="attraction.heightRestriction" class="text-md pt-3">
        {{ attraction.heightRestriction }} cm
      </span>
      <span v-else class="text-md pt-3">No restriction</span>
    </p>
  </div>
</template>
