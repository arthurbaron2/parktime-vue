<script setup lang="ts">
import { useHiddenList } from '@/stores/hiddenList'
import { useOpeningSchedule } from '@/stores/openingSchedule'
import type { AttractionLiveData } from '@/types/themeParkTypes'
import { getDiffInMinutes } from '@/utils/date'
import { computed } from 'vue'

const props = defineProps<{ liveData: AttractionLiveData; index: number; nbEntities: number }>()

const getTimerColor = (waitTime?: number) => {
  if (!waitTime) return 'bg-slate-100 text-slate-800'

  if (waitTime >= 40) return 'bg-rose-400 text-rose-950 '
  if (waitTime >= 20) return 'bg-amber-400 text-amber-950'
  if (waitTime >= 5) return 'bg-green-400 text-green-950'

  return 'bg-slate-100 text-slate-800'
}

const schedule = useOpeningSchedule()
const hiddenList = useHiddenList()
const standbyWaitTime = props.liveData.queue.STANDBY?.waitTime
const singleRiderWaitTime = props.liveData.queue.SINGLE_RIDER?.waitTime
const isHidden = computed(() => hiddenList.hiddenList.includes(props.liveData.id))
const status = computed(() => props.liveData.status)

const standbyWaitTimeClass = computed(() => getTimerColor(standbyWaitTime))
const singleRiderWaitTimeClass = computed(() => getTimerColor(singleRiderWaitTime))

const parkOpening = computed(() => {
  return schedule.schedule?.[props.liveData.parkId]
})

const closeSoon = computed(
  () =>
    getDiffInMinutes(new Date(), parkOpening.value?.closingTime) <= 60 &&
    status.value === 'OPERATING',
)
</script>

<template>
  <div
    :class="{
      'bg-slate-600': props.liveData.status === 'OPERATING',
      'bg-slate-500': props.liveData.status === 'DOWN' || props.liveData.status === 'CLOSED',
      'rounded-t-md': props.index === 0,
      'rounded-b-md': props.index === props.nbEntities - 1,
    }"
    class="px-2 py-4 relative flex items-center min-h-15 shadow-md"
  >
    <div
      class="absolute w-10 h-10 rounded-full left-2 top-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg shadow-slate-600"
      :class="standbyWaitTimeClass"
    >
      <v-icon
        v-if="status !== 'OPERATING'"
        :name="props.liveData.status === 'DOWN' ? 'fa-pause' : 'fa-stop'"
        class="text-2xl"
      />
      <p v-else class="text-2xl">{{ standbyWaitTime }}</p>
      <div
        v-if="singleRiderWaitTime"
        class="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm shadow-slate-500"
        :class="singleRiderWaitTimeClass"
      >
        {{ singleRiderWaitTime }}
      </div>
    </div>

    <h2 class="pl-12 overflow-hidden overflow-ellipsis whitespace-nowrap flex-1 font-bold">
      {{ liveData.name }}
    </h2>
    <p v-if="closeSoon" class="bg-red-400 rounded-md py-0.5 px-1 text-xs mx-1">close soon</p>
    <button
      @click="hiddenList.addToHiddenList(props.liveData.id)"
      v-if="!isHidden"
      aria-label="Hide this attraction"
      class="focus:outline-none focus:ring-2 rounded-full focus:ring-blue-500"
    >
      <v-icon name="fa-times" />
    </button>
    <button
      @click="hiddenList.removeFromHiddenList(props.liveData.id)"
      v-if="isHidden"
      aria-label="Show this attraction"
      class="focus:outline-none focus:ring-2 rounded-full focus:ring-blue-500"
    >
      <v-icon name="fa-plus" />
    </button>
  </div>
</template>
