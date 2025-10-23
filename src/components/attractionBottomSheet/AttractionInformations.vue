<script setup lang="ts">
import type { Attraction } from '@/types/parktimeapi.types'
import { computed } from 'vue'
import AttractionInterest from './AttractionInterest.vue'
import type { AttractionDetail } from '@/types/park.types'

const props = defineProps<{ attraction: Attraction }>()

const attraction = computed(() => props.attraction)

const details = computed(
  () =>
    [
      attraction.value?.parkName && {
        key: 'Park',
        value: attraction.value?.parkName,
        icon: 'fa-map-marker-alt',
        type: 'text',
      },
      attraction.value?.parkZone && {
        key: 'Zone',
        value: attraction.value?.parkZone,
        icon: 'fa-location-arrow',
        type: 'text',
      },
      attraction.value?.interests && {
        key: 'Interests',
        value: attraction.value?.interests,
        icon: 'fa-bolt',
        type: 'interests',
      },
      attraction.value?.rcdbLink && {
        key: 'Data sheet',
        value: attraction.value?.rcdbLink,
        icon: 'fa-link',
        type: 'link',
        text: `${attraction.value?.name} on rcdb.com`,
      },
    ].filter(Boolean) as AttractionDetail[],
)
</script>

<template>
  <ul class="my-4 bg-slate-500/10 rounded-xl py-2 px-4 text-sm">
    <li v-for="detail in details" :key="detail.key" class="flex items-top justify-between my-4">
      <span class="capitalize text-slate-700 flex-1 flex items-top mr-2">
        <v-icon :name="detail.icon" class="size-4 mr-1" aria-hidden="true" /> {{ detail.key }}
      </span>
      <span v-if="detail.type === 'interests'" class="flex gap-1 flex-wrap justify-end">
        <AttractionInterest v-for="item in detail.value" :key="item" :interestId="item" />
      </span>
      <span v-else-if="detail.type === 'link'">
        <a :href="detail.value as string" target="_blank" class="text-blue-500 hover:text-blue-600">
          <v-icon name="fa-external-link-alt" class="size-4" aria-hidden="true" />
          {{ detail.text }}
        </a>
      </span>
      <span v-else-if="detail.type === 'text'">
        {{ detail.value }}
      </span>
    </li>
  </ul>
</template>
