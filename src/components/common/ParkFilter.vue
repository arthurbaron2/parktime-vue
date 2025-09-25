<script setup lang="ts">
import { buttonClass } from '@/styles/buttons.styles'
import { getAllParksFromResort } from '@/utils/park'
import useCurrentPark from '@/hooks/useCurrentPark'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const currentPark = useCurrentPark()
const parksToShow = getAllParksFromResort(currentPark.value?.parkId).filter(
  (park) => park.showInParkFilter,
)

const getResortPath = (resortId: string) => {
  const currentPath = route.path
  const currentPage = currentPath.split('/').slice(2).join('/')
  return `/${resortId}${currentPage ? `/${currentPage}` : ''}`
}
</script>

<template>
  <div class="flex gap-3 pb-6 pt-4">
    <RouterLink
      v-for="park in parksToShow"
      :key="park.parkId"
      :to="getResortPath(park.id)"
      :class="
        buttonClass({
          active: currentPark?.parkId === park.parkId,
        })
      "
    >
      {{ park.parkName }}
    </RouterLink>
  </div>
</template>
