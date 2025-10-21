<script setup lang="ts">
import { computed } from 'vue'
import { getInterest } from '@/utils/attraction'

const props = defineProps<{ interestId: string }>()

const interest = computed(() => getInterest(props.interestId))
</script>

<template>
  <span class="py-0.5 px-2 text-xs rounded-full" :class="interest.color">
    {{ interest.name }}
  </span>
</template>
