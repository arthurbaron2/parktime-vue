<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFiltersStore, type Filters } from '@/stores/filters'
import type { Vueform } from '@vueform/vueform'

const form$ = ref<Vueform | null>(null)

onMounted(() => {
  form$.value?.on('change', (values: Filters) => {
    filterStore.updateSettings(values)
  })
})

const filterStore = useFiltersStore()
</script>

<template>
  <div class="flex gap-4 flex-col bg-slate-700/50 rounded-xl py-4 px-2">
    <h2 class="text-md font-bold text-center">Preferences</h2>
    <Vueform ref="form$" :default="filterStore.$state">
      <CheckboxElement name="showClosed" text="Show closed attractions" />
      <CheckboxElement name="showFavorites" text="Show only favorites rides and shows" />
      <CheckboxElement name="showNextShows" text="Show next shows on home screen" />
      <SelectElement
        name="showtimeDiff"
        :disabled="!filterStore.showNextShows"
        :native="true"
        :items="{
          15: '15 minutes',
          30: '30 minutes',
          45: '45 minutes',
          60: '1 hour',
          90: '1 hour 30',
          120: '2 hours',
          180: '3 hours',
          240: '4 hours',
        }"
        label="Show next shows in"
      />
      <CheckboxElement name="showClosingSoon" text="Show closing soon warning on home screen" />
      <SelectElement
        name="showClosingSoonDiff"
        :native="true"
        :disabled="!filterStore.showClosingSoon"
        :items="{
          30: '30 minutes',
          45: '45 minutes',
          60: '1 hour',
          90: '1 hour 30',
          120: '2 hours',
          180: '3 hours',
          240: '4 hours',
        }"
        label="Show closing soon in"
      />
    </Vueform>
  </div>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
