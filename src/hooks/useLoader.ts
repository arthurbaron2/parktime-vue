import { onMounted, ref, watch, onUnmounted, computed } from 'vue'
import useLiveData from './useLiveData'
import { formatRelativeTime } from '@/utils/date'

const useLoader = () => {
  const { dataUpdatedAt, isLoading, isFetching } = useLiveData()

  const loaderVisible = ref(false)
  let loaderTimeout: ReturnType<typeof setTimeout> | null = null

  watch(
    [isLoading, isFetching],
    ([loading, fetching]) => {
      if (loading || fetching) {
        loaderVisible.value = true
        if (loaderTimeout) clearTimeout(loaderTimeout)
      } else {
        if (loaderTimeout) clearTimeout(loaderTimeout)
        loaderTimeout = setTimeout(() => {
          loaderVisible.value = false
        }, 200)
      }
    },
    { immediate: true },
  )

  const now = ref(new Date())

  onMounted(() => {
    const interval = setInterval(() => {
      now.value = new Date()
    }, 1000)
    onUnmounted(() => clearInterval(interval))
  })

  const lastUpdateTime = computed(() => {
    void now.value // force la dépendance réactive
    if (!dataUpdatedAt?.value) return ''
    return formatRelativeTime(new Date(dataUpdatedAt.value))
  })

  return { loaderVisible, lastUpdateTime }
}

export default useLoader
