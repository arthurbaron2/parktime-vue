<script setup lang="ts">
import { useOpeningSchedule } from '@/stores/openingSchedule'
import { getDiffInMinutes, formatHoursFromMinutes } from '@/utils/date'
import { useFiltersStore } from '@/stores/filters'

const openingSchedule = useOpeningSchedule()
const filterStore = useFiltersStore()
</script>

<template>
  <div v-if="filterStore.showClosingSoon">
    <div v-for="schedule in openingSchedule.schedule" :key="schedule.parkId">
      <div v-if="schedule.closeSoon">
        <div class="bg-slate-700/50 mb-4 rounded-xl p-4 text-white flex items-center">
          <v-icon name="fa-clock" class="size-6 mr-2" />
          <div>
            <p class="text-md">
              {{ schedule.parkName }} is closing in
              {{ formatHoursFromMinutes(getDiffInMinutes(new Date(), schedule.closingTime)) }} !
            </p>
            <p class="text-xs">Did you do every attractions and shows you wanted to do ?</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
