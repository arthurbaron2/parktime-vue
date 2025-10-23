import type { Status } from '@/types/parktimeapi.types'
import { formatTimeToFrench } from './date'

// Type pour les statistiques individuelles d'une attraction
type AttractionStatistic = {
  recordedAt: string
  standbyWait: number | null
  singleRiderWait: number | null
  status: Status
}

export interface TimePoint {
  time: string
  waitTime: number
}

export interface Period {
  start: string
  end: string
}

/**
 * Transforme les données de l'API en points de temps d'attente pour le graphique
 */
export function processWaitTimes(statistics: AttractionStatistic[]): TimePoint[] {
  if (!statistics.length) return []

  const points: TimePoint[] = []

  for (let i = 0; i < statistics.length; i++) {
    const stat = statistics[i]
    const time = formatTimeToFrench(new Date(stat.recordedAt))

    // Vérifier si c'est une transition vers OPERATING
    const isTransitionToOperating =
      stat.status === 'OPERATING' &&
      i > 0 &&
      (statistics[i - 1].status === 'CLOSED' ||
        statistics[i - 1].status === 'DOWN' ||
        statistics[i - 1].status === 'REFURBISHMENT')

    if (stat.standbyWait !== null) {
      // Si c'est une transition, ajouter un point à 0 à -1 minute (seulement si waitTime > 0)
      if (isTransitionToOperating && stat.standbyWait > 0) {
        const transitionTime = new Date(stat.recordedAt)
        transitionTime.setMinutes(transitionTime.getMinutes() - 1)
        const transitionTimeStr = transitionTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })

        points.push({
          time: transitionTimeStr,
          waitTime: 0,
        })
      }

      // Ajouter le point normal
      points.push({
        time: time,
        waitTime: stat.standbyWait,
      })
    }

    // Ajouter un point à 0 au début de chaque période de fermeture/arrêt
    if (i > 0) {
      const prevStat = statistics[i - 1]
      const isTransitionToClosedOrDown =
        (stat.status === 'CLOSED' || stat.status === 'DOWN' || stat.status === 'REFURBISHMENT') &&
        prevStat.status === 'OPERATING'

      if (isTransitionToClosedOrDown) {
        const transitionTime = new Date(stat.recordedAt)
        transitionTime.setMinutes(transitionTime.getMinutes() - 1)
        const transitionTimeStr = transitionTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })

        points.push({
          time: transitionTimeStr,
          waitTime: 0,
        })
      }
    }
  }

  // Ajouter un point à 0 au début si la première statistique est OPERATING
  // Cela crée une transition depuis la période de fermeture par défaut (6h)
  if (points.length > 0 && statistics.length > 0) {
    const firstStat = statistics[0]
    if (firstStat.status === 'OPERATING' && firstStat.standbyWait !== null) {
      // Ajouter un point de transition à 0 seulement si le premier point n'est pas déjà à 0
      if (firstStat.standbyWait > 0) {
        const transitionTime = new Date(firstStat.recordedAt)
        transitionTime.setMinutes(transitionTime.getMinutes() - 1)
        const transitionTimeStr = transitionTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })

        points.unshift({
          time: transitionTimeStr,
          waitTime: 0,
        })
      }
    }
  }

  if (points.length > 0) {
    points.push({
      time: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      waitTime: points[points.length - 1].waitTime,
    })
  }

  return points
}

/**
 * Identifie les périodes de fermeture avec prolongation jusqu'à maintenant
 */
export function processClosedPeriods(
  statistics: AttractionStatistic[],
  waitTimes: TimePoint[],
): Period[] {
  if (!statistics.length) return []

  // Trouver le premier point OPERATING réel (même si waitTime = 0)
  const firstOperatingPoint = waitTimes.find((point) => point.waitTime >= 0)

  const periods: Period[] = [
    {
      start: '06:00',
      end:
        firstOperatingPoint?.time ||
        new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ]
  let currentPeriod: Period | null = null

  for (let i = 0; i < statistics.length; i++) {
    const stat = statistics[i]
    const time = formatTimeToFrench(new Date(stat.recordedAt))

    if (stat.status === 'CLOSED' || stat.status === 'REFURBISHMENT') {
      if (!currentPeriod) {
        currentPeriod = { start: time, end: time }
      }
    } else {
      if (currentPeriod) {
        // La période se termine à l'heure actuelle (transition vers OPERATING)
        currentPeriod.end = time
        periods.push(currentPeriod)
        currentPeriod = null
      }
    }
  }

  // Si la dernière période est encore fermée, elle se prolonge jusqu'à maintenant
  if (currentPeriod) {
    currentPeriod.end = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    periods.push(currentPeriod)
  }

  return periods
}

/**
 * Identifie les périodes d'arrêt avec prolongation jusqu'à maintenant
 */
export function processDownPeriods(statistics: AttractionStatistic[]): Period[] {
  if (!statistics.length || statistics.length < 2) return []

  const periods: Period[] = []
  let currentPeriod: Period | null = null

  for (let i = 0; i < statistics.length; i++) {
    const stat = statistics[i]
    const time = formatTimeToFrench(new Date(stat.recordedAt))

    if (stat.status === 'DOWN') {
      if (!currentPeriod) {
        currentPeriod = { start: time, end: time }
      }
    } else {
      if (currentPeriod) {
        // La période se termine à l'heure actuelle (transition vers OPERATING)
        currentPeriod.end = time
        periods.push(currentPeriod)
        currentPeriod = null
      }
    }
  }

  // Si la dernière période est encore en panne, elle se prolonge jusqu'à maintenant
  if (currentPeriod) {
    currentPeriod.end = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    periods.push(currentPeriod)
  }

  return periods
}

/**
 * Convertit une période en points pour Chart.js
 */
export function periodToChartPoints(period: Period, yValue: number): { x: number; y: number }[] {
  return [
    { x: new Date(`2024-01-01 ${period.start}:00`).getTime(), y: yValue },
    { x: new Date(`2024-01-01 ${period.end}:00`).getTime(), y: yValue },
    { x: new Date(`2024-01-01 ${period.end}:00`).getTime(), y: 0 },
    { x: new Date(`2024-01-01 ${period.start}:00`).getTime(), y: 0 },
  ]
}

/**
 * Convertit des points de temps d'attente en points pour Chart.js
 */
export function waitTimesToChartPoints(waitTimes: TimePoint[]): { x: number; y: number }[] {
  return waitTimes.map(({ time, waitTime }) => ({
    x: new Date(`2024-01-01 ${time}:00`).getTime(),
    y: waitTime,
  }))
}
