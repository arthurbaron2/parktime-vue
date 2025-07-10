<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters'
import { useHiddenList } from '@/stores/hiddenList'
import { useOpeningSchedule } from '@/stores/openingSchedule'
import type { AttractionLiveData, Status } from '@/types/themeParkTypes'
import { getDiffInMinutes } from '@/utils/date'
import { computed } from 'vue'

const props = defineProps<{ liveData: AttractionLiveData; index: number; nbEntities: number }>()
const filters = useFiltersStore()

const getTimerColor = (status: Status, waitTime?: number) => {
  if (waitTime === undefined || status !== 'OPERATING') return 'bg-slate-100 text-slate-800'

  if (waitTime >= 45) return 'bg-rose-400 text-rose-950 '
  if (waitTime >= 25) return 'bg-amber-400 text-amber-950'
  if (waitTime >= 0) return 'bg-green-400 text-green-950'

  return 'bg-slate-100 text-slate-800'
}

const schedule = useOpeningSchedule()
const hiddenList = useHiddenList()
const standbyWaitTime = props.liveData.queue.STANDBY?.waitTime
const singleRiderWaitTime = props.liveData.queue.SINGLE_RIDER?.waitTime
const isHidden = computed(() => hiddenList.hiddenList.includes(props.liveData.id))
const status = computed(() => props.liveData.status)

const mainWaitTime = computed(() => {
  if (filters.sortBy.includes('SINGLE_RIDER')) {
    return singleRiderWaitTime || standbyWaitTime
  }
  return standbyWaitTime
})

const backupWaitTime = computed(() => {
  if (filters.sortBy.includes('SINGLE_RIDER') && singleRiderWaitTime) {
    return standbyWaitTime
  }
  return singleRiderWaitTime
})

const mainWaitTimeClass = computed(() => getTimerColor(status.value, mainWaitTime.value))
const backupWaitTimeClass = computed(() => getTimerColor(status.value, backupWaitTime.value))

const parkOpening = computed(() => {
  return schedule.schedule?.[props.liveData.parkId]
})

const closeSoon = computed(
  () =>
    parkOpening.value &&
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
    class="px-3 py-2 relative flex items-center min-h-15 shadow-md"
  >
    <div
      class="size-10 rounded-full relative flex items-center justify-center shadow-lg shadow-slate-600"
      :class="mainWaitTimeClass"
    >
      <v-icon
        v-if="status !== 'OPERATING'"
        :name="props.liveData.status === 'DOWN' ? 'fa-pause' : 'fa-stop'"
        class="text-2xl"
      />
      <p v-else class="text-2xl">{{ mainWaitTime }}</p>
      <div
        v-if="backupWaitTime"
        class="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm shadow-slate-500"
        :class="backupWaitTimeClass"
      >
        {{ backupWaitTime }}
      </div>
    </div>

    <h2 class="pl-3 overflow-hidden overflow-ellipsis whitespace-nowrap flex-1 font-bold">
      {{ liveData.name }}
    </h2>

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
