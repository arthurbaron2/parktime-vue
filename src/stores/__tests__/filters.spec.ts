import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFiltersStore } from '../filters'

describe('useFiltersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('devrait initialiser avec les valeurs par défaut', () => {
    const store = useFiltersStore()
    expect(store.parkIdFilter).toBe('ALL')
    expect(store.entityTypeFilter).toBe('ATTRACTION')
    expect(store.sortBy).toBe('TIME_DOWN')
    expect(store.showFavorites).toBe(false)
    expect(store.showClosed).toBe(false)
  })
})
