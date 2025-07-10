import { ref } from 'vue'
import { defineStore } from 'pinia'

const LOCAL_STORAGE_KEY = 'dream-park-favorites-list'

const getStoredFavorites = (): string[] => {
  const storedList = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (storedList) {
    return JSON.parse(storedList)
  }
  return []
}

export const useFavorites = defineStore('favorites', () => {
  const favorites = ref<string[]>(getStoredFavorites())

  const toggleFavorite = (id: string) => {
    if (favorites.value.includes(id)) {
      favorites.value = favorites.value.filter((item) => item !== id)
    } else {
      favorites.value.push(id)
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites.value))
  }

  return { favorites, toggleFavorite }
})
