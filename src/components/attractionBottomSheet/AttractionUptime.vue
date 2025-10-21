<script setup lang="ts">
import type { Attraction } from '@/types/parktimeapi.types'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type TooltipItem } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import useAttractionUptime from '@/hooks/useAttractionUptime'
import { computed } from 'vue'
import { getUptimeLabel } from '@/utils/attraction'

const props = defineProps<{ attraction: Attraction }>()

const attractionUptime = useAttractionUptime({ attractionId: props.attraction.id })

ChartJS.register(ArcElement, Tooltip, Legend)

const uptime = computed(() => {
  if (!attractionUptime.value?.uptimePercentage) return
  return {
    operating: attractionUptime.value?.uptimePercentage,
    down: 100 - attractionUptime.value?.uptimePercentage,
  }
})

const data = computed(() => ({
  labels: ['Operating', 'Paused'],
  datasets: [
    {
      backgroundColor: ['#00A63E', '#FA2B36'],
      data: [uptime.value?.operating ?? 0, uptime.value?.down ?? 0],
    },
  ],
}))

const options = {
  animation: {
    duration: 0,
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<'doughnut'>) =>
          getUptimeLabel(context, attractionUptime.value),
      },
    },
  },
}
</script>

<template>
  <div class="my-4 bg-slate-500/10 rounded-xl py-2 px-4 text-sm">
    <h3 class="text-md font-bold text-center my-4">Attraction uptime</h3>
    <Doughnut :data="data" :options="options" class="w-full h-full" />
  </div>
</template>
