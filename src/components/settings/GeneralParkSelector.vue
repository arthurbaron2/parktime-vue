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
        ParkTime
        <span
          class="text-[10px] text-white bg-gradient-to-r from-fuchsia-500 to-purple-500 py-0.5 px-1 rounded-sm ml-1 box-shadow"
        >
          ALPHA
        </span>
      </p>

      <ul class="my-10 px-2 text-white md:w-1/2 mx-auto flex flex-col gap-2">
        <li class="flex items-center gap-2">
          <v-icon name="fa-clock" class="text-lg mr-2" />
          <span>Your favorites attractions and shows in real time at any time</span>
        </li>
        <li class="flex items-center gap-2">
          <v-icon name="fa-dollar-sign" class="text-lg mr-2" />
          <span>Free access without login</span>
        </li>
        <li class="flex items-center gap-2">
          <v-icon name="fa-shield-alt" class="text-md mr-2" />
          <span>No ads, no tracking, no data collection</span>
        </li>
        <li class="flex items-center gap-2">
          <v-icon name="fa-accessible-icon" class="text-md mr-2" />
          <span>Easy to use, fully accessible</span>
        </li>
        <li class="flex items-center gap-2">
          <v-icon name="fa-store-slash" class="text-md mr-2" />
          <span>Without pushing to buy a fast pass</span>
        </li>
        <li class="flex items-center gap-2">
          <v-icon name="fa-cog" class="text-md mr-2" />
          <span>A lot of options to personalize your experience</span>
        </li>
        <li class="flex items-center gap-2">
          <v-icon name="md-attractions" class="text-md mr-2" />
          <span>A lot of informations about your favorites attractions</span>
        </li>
      </ul>

      <h2 class="text-lg font-bold text-center mb-6">Please choose a resort to get started</h2>
      <div class="flex gap-4 mb-6 flex-wrap justify-center">
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
