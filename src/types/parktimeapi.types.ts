export type EntityType = 'DESTINATION' | 'PARK' | 'ATTRACTION' | 'SHOW'

export type Status = 'OPERATING' | 'DOWN' | 'CLOSED' | 'REFURBISHMENT'

export interface Destination {
  id: string
  name: string
  entityType: EntityType
  timezone: string
  liveData: LiveData[]
}

export type LiveData = ShowLiveData | AttractionLiveData

export interface ShowLiveData {
  id: string
  name: string
  entityType: 'SHOW'
  parkId: string
  showtimes: {
    type: string
    endTime: string
    startTime: string
  }[]
  status: Status
  lastUpdated: string
}

export interface AttractionLiveData {
  id: string
  name: string
  entityType: 'ATTRACTION'
  parkId: string
  standbyWait: number | null
  singleRiderWait: number | null
  status: Status
  lastUpdated: string
}

export interface ResortSchedule {
  id: string
  name: string
  entityType: 'DESTINATION'
  timezone: string
  parks: ParkSchedule[]
}

export interface ParkSchedule {
  id: string
  name: string
  entityType: 'PARK'
  schedule: Schedule[]
}

export interface Schedule {
  date: string
  type: 'EXTRA_HOURS' | 'OPERATING'
  closingTime: string
  description?: string
  openingTime: string
}

export interface DayAttractionWaitTimes {
  singleRider: AttractionWaitTime[]
  standby: AttractionWaitTime[]
  closedEvents: AttractionEvent[]
  downEvents: AttractionEvent[]
}

export interface AttractionWaitTime {
  recordedAt: string
  waitTime: number
}

export interface AttractionEvent {
  start: string
  end: string
}

export interface Attraction {
  id: string
  name: string
  parkId: string
  parkName: string
  parkZone: string
  interests: string[]
  heightRestriction: string
  rcdbLink?: string
  liveData: {
    standbyWait: number | null
    singleRiderWait: number | null
    status: Status
    recordedAt: string
  }
}

export type Period = 'yesterday' | 'today'

export interface Statistics {
  recordedAt: string
  standbyWait: number | null
  singleRiderWait: number | null
  status: Status
}

export type AttractionStatistics = Record<Period, Statistics[]>

export interface Uptime {
  totalTime: number
  operatingTime: number
  downTime: number
  uptimePercentage: number
}
