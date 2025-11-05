<script setup lang="ts">
import useCurrentPark from '@/hooks/useCurrentPark'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}

const park = useCurrentPark()
const id = computed(() => park.value?.id)
</script>

<template>
  <div
    class="flex gap-8 justify-between fixed items-center text-xs px-10 pt-3 pb-5 -bottom-0.5 left-0 right-0 bg-slate-900/50 backdrop-blur-sm"
  >
    <router-link
      :to="`/`"
      :class="{ 'text-blue-400': isActive(`/`) }"
      class="flex flex-col items-center"
    >
      <v-icon name="fa-map-signs" class="size-6" />
      <span class="mt-0.5">Parks</span>
    </router-link>
    <router-link
      :to="`/${id}/shows`"
      :class="{ 'text-blue-400': isActive(`/${id}/shows`) }"
      class="flex flex-col items-center"
    >
      <v-icon name="gi-party-hat" class="size-6" />
      <span class="mt-0.5">Shows</span>
    </router-link>
    <router-link
      :to="`/${id}`"
      :class="{ 'text-blue-400': isActive(`/${id}`) }"
      class="flex flex-col items-center"
    >
      <v-icon name="fa-home" class="size-6" />
      <span class="mt-0.5">Home</span>
    </router-link>
    <router-link
      :to="`/${id}/attractions`"
      :class="{ 'text-blue-400': isActive(`/${id}/attractions`) }"
      class="flex flex-col items-center"
    >
      <v-icon name="md-attractions" class="size-6" />
      <span class="mt-0.5">Rides</span>
    </router-link>
    <router-link
      :to="`/${id}/settings`"
      :class="{ 'text-blue-400': isActive(`/${id}/settings`) }"
      class="flex flex-col items-center"
    >
      <v-icon name="fa-cog" class="size-6" />
      <span class="mt-0.5">Settings</span>
    </router-link>
  </div>
</template>
