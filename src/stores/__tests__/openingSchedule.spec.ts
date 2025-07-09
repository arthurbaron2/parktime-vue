import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useOpeningSchedule } from '../openingSchedule'
import { ref, type Ref } from 'vue'
import { DISNEYLAND_PARK_ID, DISNEY_STUDIOS_ID } from '@/utils/constants'
import type { ResortSchedule } from '@/types/themeParkTypes'

let mockQueryReturn: { data: Ref<ResortSchedule | undefined> }

vi.mock('@tanstack/vue-query', () => ({
  useQuery: () => mockQueryReturn,
}))

const today = new Date().toISOString().split('T')[0]

const mockResortSchedule: ResortSchedule = {
  id: 'resort-id',
  name: 'Disneyland Resort',
  entityType: 'DESTINATION',
  timezone: 'Europe/Paris',
  parks: [
    {
      id: DISNEYLAND_PARK_ID,
      name: 'Disneyland Park',
      entityType: 'PARK',
      schedule: [
        {
          date: today,
          type: 'OPERATING',
          openingTime: '2024-01-01T08:00:00+01:00',
          closingTime: '2024-01-01T22:00:00+01:00',
        },
        {
          date: today,
          type: 'EXTRA_HOURS',
          openingTime: '2024-01-01T07:00:00+01:00',
          closingTime: '2024-01-01T08:00:00+01:00',
        },
        {
          date: '2024-01-02',
          type: 'OPERATING',
          openingTime: '2024-01-02T08:00:00+01:00',
          closingTime: '2024-01-02T22:00:00+01:00',
        },
      ],
    },
    {
      id: DISNEY_STUDIOS_ID,
      name: 'Walt Disney Studios',
      entityType: 'PARK',
      schedule: [
        {
          date: today,
          type: 'OPERATING',
          openingTime: '2024-01-01T09:00:00+01:00',
          closingTime: '2024-01-01T21:00:00+01:00',
        },
        {
          date: today,
          type: 'EXTRA_HOURS',
          openingTime: '2024-01-01T08:00:00+01:00',
          closingTime: '2024-01-01T09:00:00+01:00',
        },
        {
          date: '2024-01-02',
          type: 'OPERATING',
          openingTime: '2024-01-02T09:00:00+01:00',
          closingTime: '2024-01-02T21:00:00+01:00',
        },
      ],
    },
  ],
}

describe('useOpeningSchedule', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockQueryReturn = { data: ref(mockResortSchedule) }
  })

  it('devrait exposer une propriété schedule', () => {
    const store = useOpeningSchedule()
    expect(store).toHaveProperty('schedule')
  })

  it('devrait retourner les horaires formatés pour chaque parc', () => {
    const store = useOpeningSchedule()
    expect(store.schedule).toBeDefined()
    if (!store.schedule) throw new Error('store.schedule is undefined')
    const schedule = store.schedule as unknown as Record<
      string,
      { openingTime: Date; closingTime: Date }
    >
    // Disneyland Park
    expect(schedule[DISNEYLAND_PARK_ID]?.openingTime).toBeInstanceOf(Date)
    expect(schedule[DISNEYLAND_PARK_ID]?.closingTime).toBeInstanceOf(Date)
    expect(schedule[DISNEYLAND_PARK_ID]?.openingTime.toISOString()).toBe('2024-01-01T07:00:00.000Z')
    expect(schedule[DISNEYLAND_PARK_ID]?.closingTime.toISOString()).toBe('2024-01-01T21:00:00.000Z')
    // Walt Disney Studios
    expect(schedule[DISNEY_STUDIOS_ID]?.openingTime).toBeInstanceOf(Date)
    expect(schedule[DISNEY_STUDIOS_ID]?.closingTime).toBeInstanceOf(Date)
    expect(schedule[DISNEY_STUDIOS_ID]?.openingTime.toISOString()).toBe('2024-01-01T08:00:00.000Z')
    expect(schedule[DISNEY_STUDIOS_ID]?.closingTime.toISOString()).toBe('2024-01-01T20:00:00.000Z')
  })

  it('retourne undefined si data.value est undefined', () => {
    mockQueryReturn = { data: ref(undefined) }
    const store = useOpeningSchedule()
    expect(store.schedule).toBeUndefined()
  })

  it('retourne undefined si un parc est manquant', () => {
    const mockNoDisneyland: ResortSchedule = {
      ...mockResortSchedule,
      parks: mockResortSchedule.parks.filter((p) => p.id !== DISNEYLAND_PARK_ID),
    }
    mockQueryReturn = { data: ref(mockNoDisneyland) }
    const store = useOpeningSchedule()
    expect(store.schedule).toBeUndefined()
  })

  it("retourne undefined si le type OPERATING n'est pas présent pour la date du jour", () => {
    const mockNoOperating: ResortSchedule = {
      ...mockResortSchedule,
      parks: mockResortSchedule.parks.map((park) => ({
        ...park,
        schedule: park.schedule.filter((s) => s.type !== 'OPERATING' || s.date !== today),
      })),
    }
    mockQueryReturn = { data: ref(mockNoOperating) }
    const store = useOpeningSchedule()
    expect(store.schedule).toBeUndefined()
  })
})
