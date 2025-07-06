<script setup lang="ts">
import { useHiddenList } from '@/stores/hiddenList'
import type { AttractionLiveData } from '@/types/themeParkTypes'
import { computed } from 'vue'

const props = defineProps<{ liveData: AttractionLiveData }>()

const hiddenList = useHiddenList()
const standbyWaitTime = props.liveData.queue.STANDBY?.waitTime
const singleRiderWaitTime = props.liveData.queue.SINGLE_RIDER?.waitTime
const isHidden = computed(() => hiddenList.hiddenList.includes(props.liveData.id))
const status = computed(() => props.liveData.status)
</script>

<template>
  <div
    class="absolute w-10 h-10 bg-slate-100 text-black rounded-full left-2 top-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg shadow-slate-600"
  >
    <v-icon
      v-if="status !== 'OPERATING'"
      :name="props.liveData.status === 'DOWN' ? 'fa-pause' : 'fa-stop'"
      class="text-2xl"
    />
    <div class="text-2xl">{{ standbyWaitTime }}</div>
    <div
      v-if="singleRiderWaitTime"
      class="absolute -top-2 -right-2 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm shadow-slate-500"
    >
      {{ singleRiderWaitTime }}
    </div>
  </div>

  <h2 class="pl-12 overflow-hidden overflow-ellipsis whitespace-nowrap flex-1">
    {{ liveData.name }}
  </h2>
  <button @click="hiddenList.addToHiddenList(props.liveData.id)" v-if="!isHidden">
    <v-icon name="fa-times" />
  </button>
  <button @click="hiddenList.removeFromHiddenList(props.liveData.id)" v-if="isHidden">
    <v-icon name="fa-plus" />
  </button>
</template>
