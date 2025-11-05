<script setup lang="ts">
import type { Attraction } from '@/types/parktimeapi.types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed } from 'vue'
import 'chartjs-adapter-date-fns'
import useAttractionWaitTimes from '@/hooks/useAttractionWaitTimes'
import {
  processStandbyWaitTimesFromDayData,
  processSingleRiderWaitTimesFromDayData,
  processClosedPeriodsFromDayData,
  processDownPeriodsFromDayData,
  periodToChartPoints,
  waitTimesToChartPoints,
} from '@/utils/attractionWaitTimeline'
import { getOptions } from './attractionWaitTimelineChart.config'
import { getParkFromId } from '@/utils/park'

const props = defineProps<{ attraction: Attraction }>()

const timezone = computed(() => {
  return getParkFromId(props.attraction.parkId)?.timezone || 'Europe/Paris'
})

const waitTimeline = useAttractionWaitTimes({ attractionId: props.attraction.id })

// Utiliser les fonctions utilitaires pour traiter les données
const waitTimes = computed(() => {
  if (!waitTimeline.value) return []
  return processStandbyWaitTimesFromDayData(waitTimeline.value, timezone.value)
})

const singleRiderWaitTimes = computed(() => {
  if (!waitTimeline.value) return []
  return processSingleRiderWaitTimesFromDayData(waitTimeline.value, timezone.value)
})

const closedPeriods = computed(() => {
  if (!waitTimeline.value) return []
  return processClosedPeriodsFromDayData(waitTimeline.value, timezone.value)
})

const downPeriods = computed(() => {
  if (!waitTimeline.value) return []
  return processDownPeriodsFromDayData(waitTimeline.value, timezone.value)
})

const data = computed(() => {
  const datasets = []

  closedPeriods.value.forEach((period, index) => {
    datasets.push({
      label: `Close ${index + 1}`,
      data: periodToChartPoints(period, 0),
      borderColor: '#FA2B36',
      backgroundColor: '#FA2B36',
      borderWidth: 3,
      fill: true,
      pointRadius: 0,
    })
  })

  downPeriods.value.forEach((period, index) => {
    datasets.push({
      label: `Pause ${index + 1}`,
      data: periodToChartPoints(period, 0),
      borderColor: '#FDC800',
      backgroundColor: '#FDC800',
      borderWidth: 3,
      fill: true,
      pointRadius: 0,
    })
  })

  datasets.push({
    label: 'Waiting time',
    data: waitTimesToChartPoints(waitTimes.value),
    borderColor: '#2C7FFF',
    backgroundColor: '#2C7FFF',
    borderWidth: 2,
    fill: true,
    stepped: 'before' as const,
    pointRadius: 0,
    borderRadius: 8,
  })

  if (singleRiderWaitTimes.value.length > 0) {
    datasets.push({
      label: 'Single rider',
      data: waitTimesToChartPoints(singleRiderWaitTimes.value),
      borderColor: '#009866',
      backgroundColor: '#009866',
      borderWidth: 2,
      fill: false,
      stepped: 'before' as const,
      pointRadius: 0,
    })
  }

  return { datasets }
})

const chartOptions = computed(() => getOptions(timezone.value))

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
)
</script>

<template>
  <div class="my-4 bg-slate-500/10 rounded-xl py-4 px-4 text-sm">
    <h3 class="text-lg font-bold text-center mb-4 text-gray-800">Waiting time</h3>
    <div class="flex items-center justify-center gap-2 flex-wrap">
      <span class="flex items-center gap-1"><span class="w-4 h-1 bg-red-500" />Closed</span>
      <span class="flex items-center gap-1"><span class="w-4 h-1 bg-yellow-500" />Paused</span>
      <span class="flex items-center gap-1"><span class="w-4 h-1 bg-blue-500" />Standby</span>
      <span v-if="singleRiderWaitTimes.length > 2" class="flex items-center gap-1">
        <span class="w-4 h-1 bg-emerald-600" />Single rider
      </span>
    </div>
    <div v-if="data.datasets.length > 2" class="h-50">
      <Line :data="data" :options="chartOptions" />
    </div>
    <div v-else class="flex items-center justify-center my-8">No data available for today</div>
  </div>
</template>
