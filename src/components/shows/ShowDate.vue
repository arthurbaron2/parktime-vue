<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  showtime: string
}>()

const time = computed(() => {
  const date = new Date(props.showtime)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <p class="bg-slate-200 rounded-md p-2 text-slate-950 text-xs font-bold">
    {{ time }}
  </p>
</template>
