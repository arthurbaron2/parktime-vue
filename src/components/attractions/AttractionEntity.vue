<script setup lang="ts">
import { useFavorites } from '@/stores/favorites'
import type { AttractionLiveData } from '@/types/themeParkTypes'
import { computed } from 'vue'
import useWaitTime from '@/hooks/useWaitTime'

const props = defineProps<{ liveData: AttractionLiveData }>()

const favoritesStore = useFavorites()
const isFavorite = computed(() => favoritesStore.favorites.includes(props.liveData.id))
const status = computed(() => props.liveData.status)

const { mainWaitTime, backupWaitTime, mainWaitTimeClass, backupWaitTimeClass } = useWaitTime({
  liveData: props.liveData,
})
</script>

<template>
  <div
    :class="{
      'bg-slate-300/30 shadow-slate-700/50': props.liveData.status === 'OPERATING',
      'bg-slate-200/30 shadow-slate-600/50':
        props.liveData.status === 'DOWN' || props.liveData.status === 'CLOSED',
    }"
    class="px-3 py-2 relative flex items-center min-h-15 rounded-xl"
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

    <h2 class="pl-3 overflow-hidden overflow-ellipsis whitespace-nowrap flex-1 font-bold">
      {{ liveData.name }}
    </h2>

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
</template>
