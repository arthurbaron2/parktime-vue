import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHiddenList = defineStore('hiddenList', () => {
  const hiddenList = ref<string[]>([])

  const addToHiddenList = (id: string) => {
    if (!hiddenList.value.includes(id)) {
      hiddenList.value.push(id)
    }
  }

  const removeFromHiddenList = (id: string) => {
    hiddenList.value = hiddenList.value.filter((item) => item !== id)
  }

  return { hiddenList, addToHiddenList, removeFromHiddenList }
})
