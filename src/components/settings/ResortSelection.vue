<script setup lang="ts">
import { getResorts } from '@/utils/park'
import useCurrentPark from '@/hooks/useCurrentPark'

const resorts = getResorts()
const park = useCurrentPark()
</script>

<template>
  <div class="flex gap-4 flex-col bg-slate-700/50 rounded-xl py-4 px-2 mt-6">
    <h2 class="text-md font-bold text-center">Resort selection</h2>
    <div class="flex gap-2 flex-wrap">
      <RouterLink
        v-for="resort in resorts"
        :key="resort.parkId"
        :to="`/${resort.id}`"
        class="p-4 rounded-xl"
        :class="{
          'bg-slate-300/50': park?.parkId === resort.parkId,
          'bg-slate-300/10': park?.parkId !== resort.parkId,
        }"
      >
        {{ resort.parkName }}
      </RouterLink>
    </div>
  </div>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
