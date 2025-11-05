import type { AttractionEvent, DayAttractionWaitTimes } from '@/types/parktimeapi.types'
import { formatTime } from './date'

export interface TimePoint {
  time: string
  waitTime: number
}

type EventType = 'wait' | 'closed' | 'down'

interface TimelineEvent {
  time: string
  waitTime: number
  type: EventType
}

const createTimelineEvent = (time: string, waitTime: number, type: EventType): TimelineEvent => ({
  time,
  waitTime,
  type,
})

const hasDataAtTime = (
  standbyData: { recordedAt: string }[],
  time: string,
  timezone: string,
): boolean => standbyData.some((wt) => formatTime(wt.recordedAt, timezone) === time)

const addEventsIfNoData = (
  events: AttractionEvent[],
  standbyData: { recordedAt: string }[],
  eventType: 'closed' | 'down',
  timelineEvents: TimelineEvent[],
  timezone: string,
) => {
  events.forEach((event) => {
    const startTime = formatTime(event.start, timezone)
    const endTime = formatTime(event.end, timezone)

    if (!hasDataAtTime(standbyData, startTime, timezone)) {
      timelineEvents.push(createTimelineEvent(startTime, 0, eventType))
    }
    if (!hasDataAtTime(standbyData, endTime, timezone)) {
      timelineEvents.push(createTimelineEvent(endTime, 0, eventType))
    }
  })
}

const sortEventsByTime = (events: TimelineEvent[]): TimelineEvent[] =>
  events.sort((a, b) => {
    const timeA = new Date(`2024-01-01 ${a.time}:00`).getTime()
    const timeB = new Date(`2024-01-01 ${b.time}:00`).getTime()
    return timeA - timeB
  })

const processTimelineEvents = (events: TimelineEvent[]): TimePoint[] => {
  const points: TimePoint[] = []
  let isInClosedOrDownPeriod = false

  for (const event of events) {
    if (event.type === 'wait') {
      isInClosedOrDownPeriod = false
      points.push({ time: event.time, waitTime: event.waitTime })
    } else {
      const isStartOfPeriod: boolean = !isInClosedOrDownPeriod
      isInClosedOrDownPeriod = isStartOfPeriod
      points.push({ time: event.time, waitTime: 0 })
    }
  }

  return points
}

export const periodToChartPoints = (
  period: AttractionEvent,
  yValue: number,
): { x: number; y: number }[] => [
  { x: new Date(`2024-01-01 ${period.start}:00`).getTime(), y: yValue },
  { x: new Date(`2024-01-01 ${period.end}:00`).getTime(), y: yValue },
]

export const waitTimesToChartPoints = (waitTimes: TimePoint[]): { x: number; y: number }[] =>
  waitTimes.map(({ time, waitTime }) => ({
    x: new Date(`2024-01-01 ${time}:00`).getTime(),
    y: waitTime,
  }))

const removeDuplicateTimelineEvents = (events: TimelineEvent[]): TimelineEvent[] => {
  return events.filter((event, index) =>
    index === 0 ? true : event.waitTime !== events[index - 1].waitTime,
  )
}

const processTimelineFromData = ({
  waitTimes,
  closedEvents,
  downEvents,
  hasLastEvent = true,
  timezone,
}: {
  waitTimes: { recordedAt: string; waitTime: number }[]
  closedEvents: AttractionEvent[]
  downEvents: AttractionEvent[]
  timezone: string
  hasLastEvent: boolean
}) => {
  const timelineEvents: TimelineEvent[] = []

  waitTimes.forEach((waitTime) => {
    timelineEvents.push(
      createTimelineEvent(formatTime(waitTime.recordedAt, timezone), waitTime.waitTime, 'wait'),
    )
  })

  const uniqueTimelineEvents = removeDuplicateTimelineEvents(timelineEvents)

  const lastEvent = uniqueTimelineEvents[uniqueTimelineEvents.length - 1]

  if (lastEvent && hasLastEvent) {
    uniqueTimelineEvents.push(
      createTimelineEvent(formatTime(new Date(), timezone), lastEvent.waitTime, 'wait'),
    )
  }

  addEventsIfNoData(closedEvents, waitTimes, 'closed', uniqueTimelineEvents, timezone)
  addEventsIfNoData(downEvents, waitTimes, 'down', uniqueTimelineEvents, timezone)

  const sortedEvents = sortEventsByTime(uniqueTimelineEvents)

  return processTimelineEvents(sortedEvents)
}

export const processStandbyWaitTimesFromDayData = (
  dayData: DayAttractionWaitTimes,
  timezone: string,
): TimePoint[] =>
  processTimelineFromData({
    waitTimes: dayData.standby,
    closedEvents: dayData.closedEvents,
    downEvents: dayData.downEvents,
    timezone,
    hasLastEvent: true,
  })

export const processSingleRiderWaitTimesFromDayData = (
  { singleRider, closedEvents, downEvents }: DayAttractionWaitTimes,
  timezone: string,
): TimePoint[] =>
  singleRider.length > 0
    ? processTimelineFromData({
        waitTimes: singleRider,
        closedEvents: closedEvents,
        downEvents: downEvents,
        timezone,
        hasLastEvent: singleRider[singleRider.length - 1].waitTime !== 0,
      })
    : []

export const processClosedPeriodsFromDayData = (
  dayData: DayAttractionWaitTimes,
  timezone: string,
): AttractionEvent[] =>
  dayData.closedEvents.map((event) => ({
    start: formatTime(event.start, timezone),
    end: formatTime(event.end, timezone),
  }))

export const processDownPeriodsFromDayData = (
  dayData: DayAttractionWaitTimes,
  timezone: string,
): AttractionEvent[] =>
  dayData.downEvents.map((event) => ({
    start: formatTime(event.start, timezone),
    end: formatTime(event.end, timezone),
  }))
