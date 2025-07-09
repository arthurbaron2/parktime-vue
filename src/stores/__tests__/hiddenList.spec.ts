import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useHiddenList } from '../hiddenList'

describe('useHiddenList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('devrait initialiser la liste comme vide', () => {
    const store = useHiddenList()
    expect(store.hiddenList).toEqual([])
  })

  // Ajouter d'autres tests ici
})
