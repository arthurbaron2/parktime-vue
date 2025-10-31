import type { AttractionEvent, DayAttractionWaitTimes } from '@/types/parktimeapi.types'
import { formatTimeToFrench } from './date'

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

const hasDataAtTime = (standbyData: { recordedAt: string }[], time: string): boolean =>
  standbyData.some((wt) => formatTimeToFrench(new Date(wt.recordedAt)) === time)

const addEventsIfNoData = (
  events: AttractionEvent[],
  standbyData: { recordedAt: string }[],
  eventType: 'closed' | 'down',
  timelineEvents: TimelineEvent[],
) => {
  events.forEach((event) => {
    const startTime = formatTimeToFrench(new Date(event.start))
    const endTime = formatTimeToFrench(new Date(event.end))

    if (!hasDataAtTime(standbyData, startTime)) {
      timelineEvents.push(createTimelineEvent(startTime, 0, eventType))
    }
    if (!hasDataAtTime(standbyData, endTime)) {
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
      createTimelineEvent(
        formatTimeToFrench(new Date(waitTime.recordedAt)),
        waitTime.waitTime,
        'wait',
      ),
    )
  })

  const uniqueTimelineEvents = removeDuplicateTimelineEvents(timelineEvents)

  const lastEvent = uniqueTimelineEvents[uniqueTimelineEvents.length - 1]

  if (lastEvent && hasLastEvent) {
    uniqueTimelineEvents.push(
      createTimelineEvent(formatTimeToFrench(new Date()), lastEvent.waitTime, 'wait'),
    )
  }

  addEventsIfNoData(closedEvents, waitTimes, 'closed', uniqueTimelineEvents)
  addEventsIfNoData(downEvents, waitTimes, 'down', uniqueTimelineEvents)

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
): AttractionEvent[] =>
  dayData.closedEvents.map((event) => ({
    start: formatTimeToFrench(new Date(event.start)),
    end: formatTimeToFrench(new Date(event.end)),
  }))

export const processDownPeriodsFromDayData = (dayData: DayAttractionWaitTimes): AttractionEvent[] =>
  dayData.downEvents.map((event) => ({
    start: formatTimeToFrench(new Date(event.start)),
    end: formatTimeToFrench(new Date(event.end)),
  }))
