<script setup lang="ts">
import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
import '@douxcode/vue-spring-bottom-sheet/dist/style.css'
import { ref } from 'vue'
import { useFavorites } from '@/stores/favorites'
import type { AttractionLiveData } from '@/types/parktimeapi.types'
import { computed } from 'vue'
import useWaitTime from '@/hooks/useWaitTime'
import AttractionBottomSheet from '@/components/attractionBottomSheet/AttractionBottomSheet.vue'

const props = defineProps<{ liveData: AttractionLiveData }>()

const favoritesStore = useFavorites()
const isFavorite = computed(() => favoritesStore.favorites.includes(props.liveData.id))
const status = computed(() => props.liveData.status)

const { mainWaitTime, backupWaitTime, mainWaitTimeClass, backupWaitTimeClass } = useWaitTime({
  liveData: props.liveData,
})

const sheet = ref(false)
const instinctHeight = ref(0)
const screenHeight = computed(() => document.documentElement.clientHeight)
</script>

<template>
  <div
    :class="{
      'bg-slate-300/30 shadow-slate-700/50': props.liveData.status === 'OPERATING',
      'bg-slate-200/30 shadow-slate-600/50':
        props.liveData.status === 'DOWN' || props.liveData.status === 'CLOSED',
    }"
    class="px-3 py-2 relative flex items-center min-h-15 rounded-xl max-w-full"
  >
    <div
      class="size-10 rounded-full relative flex items-center justify-center shadow-md shadow-slate-700/50"
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
        class="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm shadow-slate-700/50"
        :class="backupWaitTimeClass"
      >
        {{ backupWaitTime }}
      </div>
    </div>

    <button
      type="button"
      @click="sheet = true"
      class="pl-3 overflow-hidden overflow-ellipsis whitespace-nowrap text-left flex-1 font-bold"
    >
      {{ liveData.name }}
    </button>

    <div class="ml-3">
      <button
        @click="favoritesStore.toggleFavorite(props.liveData.id)"
        aria-label="Add to favorites"
        class="rounded-xl bg-slate-200 size-10 flex items-center justify-center active:bg-slate-100 transition-colors duration-300"
        :class="{ 'text-red-400': isFavorite, 'text-slate-600': !isFavorite }"
      >
        <v-icon name="fa-heart" class="text-xl" />
      </button>
    </div>
  </div>
  <BottomSheet
    v-model="sheet"
    :snap-points="[instinctHeight]"
    @instinct-height="(n) => (instinctHeight = n >= screenHeight ? n * 0.85 : n)"
  >
    <AttractionBottomSheet :attractionId="props.liveData.id" />
  </BottomSheet>
</template>

<style>
:root {
  --vsbs-max-width: 2000px;
  --vsbs-background: #e2e8f1;
}
</style>
