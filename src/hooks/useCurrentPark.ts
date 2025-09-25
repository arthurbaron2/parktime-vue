import { getParkFromId } from '@/utils/park'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const useCurrentPark = () => {
  const route = useRoute()
  const parkId = ref<string | undefined>(route.params.id as string | undefined)

  watch(
    () => route.params.id,
    () => {
      const id = route.params.id as string | undefined
      parkId.value = id
    },
  )

  const park = computed(() => {
    const id = parkId.value

    if (!id) {
      return null
    }

    return getParkFromId(id)
  })

  return park
}

export default useCurrentPark
