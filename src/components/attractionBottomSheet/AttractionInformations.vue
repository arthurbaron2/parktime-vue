<script setup lang="ts">
import type { Attraction } from '@/types/parktimeapi.types'
import { computed } from 'vue'
import AttractionInterest from './AttractionInterest.vue'

const props = defineProps<{ attraction: Attraction }>()

const attraction = computed(() => props.attraction)

const details = computed(
  () =>
    [
      attraction.value?.parkName && {
        key: 'Park',
        value: attraction.value?.parkName,
        icon: 'fa-map-marker-alt',
      },
      attraction.value?.parkZone && {
        key: 'Zone',
        value: attraction.value?.parkZone,
        icon: 'fa-location-arrow',
      },
      attraction.value?.interests && {
        key: 'Interests',
        value: attraction.value?.interests,
        icon: 'fa-bolt',
      },
    ].filter(Boolean) as { key: string; value: string | string[]; icon: string }[],
)
</script>

<template>
  <ul class="my-4 bg-slate-500/10 rounded-xl py-2 px-4 text-sm">
    <li
      v-for="{ key, value, icon } in details"
      :key="key"
      class="flex items-top justify-between my-4"
    >
      <span class="capitalize text-slate-700 flex-1 flex items-top mr-2">
        <v-icon :name="icon" class="size-4 mr-1" aria-hidden="true" /> {{ key }}
      </span>
      <span v-if="Array.isArray(value)" class="flex gap-1 flex-wrap justify-end">
        <AttractionInterest v-for="item in value" :key="item" :interestId="item" />
      </span>
      <span v-else>
        {{ value }}
      </span>
    </li>
  </ul>
</template>
