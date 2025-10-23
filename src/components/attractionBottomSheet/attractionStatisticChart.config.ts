import type { TooltipItem } from 'chart.js'
import { formatTimeToFrench } from '@/utils/date'

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  layout: {
    padding: {
      right: 5,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  scales: {
    x: {
      type: 'time' as const,
      time: {
        unit: 'hour' as const,
        stepSize: 1,
        displayFormats: {
          hour: 'HH:mm',
          minute: 'HH:mm',
        },
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        maxTicksLimit: 12,
        color: '#6B7280',
        font: {
          size: 11,
        },
      },
      title: {
        display: false,
      },
    },
    y: {
      type: 'linear' as const,
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 11,
        },
        callback: function (value: number | string) {
          return value + ' min'
        },
      },
      title: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#3B82F6',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      filter: function (tooltipItem: TooltipItem<'line'>) {
        return tooltipItem.dataset.label === 'Waiting time' && tooltipItem.parsed.y !== 0
      },
      callbacks: {
        title: function (context: TooltipItem<'line'>[]) {
          if (context[0]?.parsed.x === null) return ''
          const date = new Date(context[0].parsed.x)
          return formatTimeToFrench(date)
        },
        label: function (context: TooltipItem<'line'>) {
          return `${context.dataset.label}: ${context.parsed.y} minutes`
        },
      },
    },
  },
}
