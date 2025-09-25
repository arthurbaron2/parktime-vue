<script setup lang="ts">
import { RouterView } from 'vue-router'
import useLiveData from '@/hooks/useLiveData'

import NavigationMenu from '@/components/common/NavigationMenu.vue'
import useCurrentPark from '@/hooks/useCurrentPark'
import { parkGradientClass } from '@/styles/buttons.styles'

const park = useCurrentPark()
const { error, refetch } = useLiveData()
</script>

<template>
  <div v-if="error" class="flex justify-center">
    <div class="text-red-700 p-6 mt-6 text-center bg-slate-50 rounded-xl">
      <p>{{ error }}</p>
      <button @click="refetch()" class="py-2 px-4 rounded-xl bg-slate-500 text-white mt-2">
        Retry
      </button>
    </div>
  </div>
  <main
    v-else
    class="pb-17 min-h-screen"
    :class="parkGradientClass({ park: park?.parkId || 'default' })"
  >
    <h1 class="sr-only">Park time travel</h1>
    <div class="p-2">
      <RouterView />
    </div>
  </main>
  <NavigationMenu v-if="park" />
</template>
