<script setup lang="ts">
const props = defineProps<{
  count: number
}>()
</script>

<template>
  <div class="flex gap-2 flex-col">
    <div
      v-for="i in props.count"
      :key="i"
      class="flex rounded-xl animate-pulse w-full bg-slate-300/30 shadow-slate-700/50 px-3 py-2 relative items-center min-h-15 shadow-md"
    >
      <span class="flex-1 h-4 bg-slate-100/50 rounded-full ml-3" />
      <span class="w-14 h-8 rounded-md ml-3 bg-slate-100/50" />
    </div>
  </div>
</template>

<style></style>
