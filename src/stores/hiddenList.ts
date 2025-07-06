import { ref } from 'vue'
import { defineStore } from 'pinia'

const LOCAL_STORAGE_KEY = 'dream-park-hidden-list'

const getStoredHiddenList = (): string[] => {
  const storedList = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (storedList) {
    return JSON.parse(storedList)
  }
  return []
}

export const useHiddenList = defineStore('hiddenList', () => {
  const hiddenList = ref<string[]>(getStoredHiddenList())

  const addToHiddenList = (id: string) => {
    if (!hiddenList.value.includes(id)) {
      hiddenList.value.push(id)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(hiddenList))
    }
  }

  const removeFromHiddenList = (id: string) => {
    hiddenList.value = hiddenList.value.filter((item) => item !== id)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(hiddenList))
  }

  return { hiddenList, addToHiddenList, removeFromHiddenList }
})
