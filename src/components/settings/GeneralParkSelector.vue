<script setup lang="ts">
import { getResorts } from '@/utils/park'
import { parkButtonClass, parkGradientClass } from '@/styles/buttons.styles'
import useCurrentPark from '@/hooks/useCurrentPark'

const park = useCurrentPark()

const resorts = getResorts()
</script>

<template>
  <div class="flex flex-col w-full items-center">
    <div class="bg-slate-700/50 rounded-xl py-4 px-2">
      <p
        class="text-3xl my-6 bg-slate-800 rounded-xl text-transparent bg-clip-text font-extrabold flex justify-center items-start"
        :class="parkGradientClass({ park: park?.parkId || 'default' })"
      >
        Park Time travel
        <span
          class="text-[10px] text-white bg-gradient-to-r from-fuchsia-500 to-purple-500 py-0.5 px-1 rounded-sm ml-1 box-shadow"
        >
          ALPHA
        </span>
      </p>
      <p class="text-center my-10 text-white">
        Get the waiting time of your favorite attractions and shows in real time, for free and at
        any time, in the simplest way, without ads and without pushing to buy a fast pass.
      </p>
      <h2 class="text-lg font-bold text-center mb-6">Please choose a resort to get started</h2>
      <div class="flex gap-4 flex-wrap justify-center">
        <RouterLink
          v-for="resort in resorts"
          :key="resort.parkId"
          :to="`/${resort.id}`"
          :class="
            parkButtonClass({
              active: false,
              park: resort.parkId,
            })
          "
        >
          <span class="bg-slate-700/80 rounded-[10px] p-6 transition-all duration-200">
            {{ resort.parkName }}
          </span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
