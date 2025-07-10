import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFavorites } from '../favorites'

describe('useFavorites', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('devrait initialiser la liste comme vide', () => {
    const store = useFavorites()
    expect(store.favorites).toEqual([])
  })

  // Ajouter d'autres tests ici
})
